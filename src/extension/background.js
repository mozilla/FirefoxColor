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

  const newTheme = {
    images: {},
    properties: {},
    colors: {}
  };

  const custom_backgrounds = theme.images.custom_backgrounds || [];
  if (custom_backgrounds.length > 0) {
    const additional_backgrounds = [];
    const additional_backgrounds_alignment = [];
    const additional_backgrounds_tiling = [];

    custom_backgrounds.forEach(({ name, alignment, tiling }) => {
      const background = customBackgrounds[name];
      if (!background || !background.image) {
        return;
      }
      additional_backgrounds.push(background.image);
      additional_backgrounds_alignment.push(alignment || "left top");
      additional_backgrounds_tiling.push(tiling || "no-repeat");
    });

    newTheme.images.additional_backgrounds = additional_backgrounds;
    Object.assign(newTheme.properties, {
      additional_backgrounds_alignment,
      additional_backgrounds_tiling
    });
  } else {
    const background = normalizeThemeBackground(
      theme.images.additional_backgrounds[0]
    );
    if (background) {
      newTheme.images.additional_backgrounds = [bgImages(background)];
      Object.assign(newTheme.properties, {
        additional_backgrounds_alignment: ["top"],
        additional_backgrounds_tiling: ["repeat"]
      });
    }
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

  if (!theme.colors.hasOwnProperty("popup")) {
    newTheme.colors.popup = colorToCSS(theme.colors.accentcolor);
  }

  if (!theme.colors.hasOwnProperty("popup_text")) {
    newTheme.colors.popup_text = colorToCSS(theme.colors.toolbar_text);
  }

  browser.theme.update(newTheme);
};

init();
