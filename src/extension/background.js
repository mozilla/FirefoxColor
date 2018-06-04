import { makeLog } from "../lib/utils";
import {
  normalizeTheme,
  normalizeThemeBackground,
  colorToCSS
} from "../lib/themes";
import { bgImages } from "../lib/assets";
import Metrics from "../lib/metrics";

// Blank 1x1 PNG from http://png-pixel.com/
const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const log = makeLog("background");

const siteUrl = process.env.SITE_URL;

const siteTabMetrics = {};

const init = () => {
  Metrics.init("addon");

  browser.browserAction.onClicked.addListener(() => {
    queryAndFocusTab("fromAddon=true");
  });

  browser.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(messageListener(port));
    port.postMessage({ type: "hello" });
  });

  browser.tabs.query({}).then(tabs => {
    tabs.filter(tab => tab.url.includes(siteUrl)).forEach(tab => {
      if (!siteTabMetrics[tab.id]) {
        siteTabMetrics[tab.id] = {};
      }
    });
  });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.includes(siteUrl)) {
      if (!siteTabMetrics[tab.id]) {
        siteTabMetrics[tab.id] = {};
      }
    } else if (siteTabMetrics[tab.id]) {
      finishVisit(tab.id);
      delete siteTabMetrics[tab.id];
    }
  });

  browser.tabs.onRemoved.addListener(tabId => {
    if (siteTabMetrics[tabId]) {
      finishVisit(tabId);
      delete siteTabMetrics[tabId];
    }
  });

  browser.windows.onCreated.addListener(() => {
    fetchTheme().then(applyTheme);
  });

  fetchFirstRunDone().then(({ firstRunDone }) => {
    log("firstRunDone", firstRunDone);
    if (firstRunDone) {
      fetchTheme().then(applyTheme);
    } else {
      log("Opening first run tab");
      queryAndFocusTab("firstRun=true", true);
      setFirstRunDone();
    }
  });
};

const finishVisit = tabId => {
  log("finishVisit", tabId, siteTabMetrics[tabId]);
  Metrics.applyParameters(siteTabMetrics[tabId]);
  Metrics.finishVisit();
};

const messageListener = port => message => {
  const tabId = port.sender.tab.id;
  let theme;
  switch (message.type) {
    case "fetchTheme":
      log("fetchTheme");
      fetchTheme().then(({ theme: currentTheme }) =>
        port.postMessage({ type: "fetchedTheme", theme: currentTheme })
      );
      break;
    case "setTheme":
      theme = normalizeTheme(message.theme);
      log("setTheme", theme);
      storeTheme({ theme });
      applyTheme({ theme });
      break;
    case "setMetrics":
      siteTabMetrics[tabId] = message.params;
      log("setMetrics for tab", tabId);
      break;
    case "ping":
      port.postMessage({ type: "pong" });
      break;
    default:
      log("unexpected message", message);
  }
};

const queryAndFocusTab = (params, reload = false) => {
  browser.tabs.query({ currentWindow: true }).then(tabs => {
    const siteTab = tabs.find(tab => tab.url.includes(siteUrl));
    if (siteTab) {
      if (reload) {
        browser.tabs.update(siteTab.id, {
          active: true,
          url: `${siteTab.url}${siteTab.url.includes("?") ? "&" : "?"}${params}`
        });
      } else {
        browser.tabs.update(siteTab.id, { active: true });
      }
    } else {
      browser.tabs.create({ url: `${siteUrl}?${params}` });
    }
  });
};

const fetchFirstRunDone = () => browser.storage.local.get("firstRunDone");

const setFirstRunDone = () => browser.storage.local.set({ firstRunDone: true });

const fetchTheme = () => browser.storage.local.get("theme");

const storeTheme = ({ theme }) => browser.storage.local.set({ theme });

const applyTheme = ({ theme }) => {
  log("applyTheme", theme);
  if (!theme) {
    return;
  }

  const newTheme = {
    properties: {
      additional_backgrounds_alignment: ["top"],
      additional_backgrounds_tiling: ["repeat"]
    },
    colors: {}
  };

  const background = normalizeThemeBackground(
    theme.images.additional_backgrounds[0]
  );
  if (background) {
    newTheme.images = {
      additional_backgrounds: [bgImages(background)]
    };
  }

  // the headerURL is required in < 60,
  // but it creates an ugly text shadow.
  // So only add it for older FFs only.
  const fxVersion = navigator.userAgent.toLowerCase().split("firefox/")[1];
  if (fxVersion < 60) {
    newTheme.images.headerURL = BLANK_IMAGE;
  }

  Object.keys(theme.colors).forEach(key => {
    newTheme.colors[key] = colorToCSS(theme.colors[key]);
  });

  // TODO: we will need to actually create this field in
  // theme manifests as part of #93.
  if (!theme.colors.hasOwnProperty("tab_loading")) {
    newTheme.colors.tab_loading = colorToCSS(theme.colors.tab_line);
  }

  browser.theme.update(newTheme);
};

init();
