import { makeLog } from "../lib/utils";
import { convertToBrowserTheme, normalizeTheme } from "../lib/themes";
import { bgImages } from "../lib/assets";
import Metrics from "../lib/metrics";

const log = makeLog("background");

const siteUrl = process.env.SITE_URL;

const siteTabMetrics = {};

let customBackgrounds = {};

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
      fetchImages()
        .then(({ images }) => {
          customBackgrounds = images || {};
          return fetchTheme();
        })
        .then(applyTheme);
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
  const { type } = message;
  messageHandlers[type in messageHandlers ? type : "default"](message, port);
};

const messageHandlers = {
  fetchTheme: (message, port) => {
    log("fetchTheme");
    fetchTheme().then(({ theme: currentTheme }) =>
      port.postMessage({ type: "fetchedTheme", theme: currentTheme })
    );
  },
  setTheme: message => {
    const theme = normalizeTheme(message.theme);
    log("setTheme", theme);
    storeTheme({ theme });
    applyTheme({ theme });
  },
  setMetrics: (message, port) => {
    const tabId = port.sender.tab.id;
    siteTabMetrics[tabId] = message.params;
    log("setMetrics for tab", tabId);
  },
  ping: (message, port) => {
    port.postMessage({ type: "pong" });
  },
  addImage: ({ image }) => {
    log("addImage", image, customBackgrounds);
    customBackgrounds[image.name] = image;
    storeImages({ images: customBackgrounds });
  },
  addImages: ({ images = {} }) => {
    log("addImages", images, customBackgrounds);
    Object.assign(customBackgrounds, images);
    storeImages({ images: customBackgrounds });
  },
  updateImage: ({ image }) => {
    log("updateImage", image, customBackgrounds);
    const orig = customBackgrounds[image.name];
    customBackgrounds[image.name] = { ...orig, ...image };
    storeImages({ images: customBackgrounds });
  },
  deleteImages: ({ images }) => {
    log("deleteImages", images, customBackgrounds);
    images.forEach(name => delete customBackgrounds[name]);
    storeImages({ images: customBackgrounds });
  },
  default: message => {
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

const fetchImages = () => browser.storage.local.get("images");

const storeImages = ({ images }) => browser.storage.local.set({ images });

const applyTheme = ({ theme }) => {
  log("applyTheme", theme);
  if (!theme) {
    return;
  }
  browser.theme.update(
    convertToBrowserTheme(theme, bgImages, customBackgrounds)
  );
};

init();
