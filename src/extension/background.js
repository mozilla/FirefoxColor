import { makeLog } from "../lib/utils";
import { convertToBrowserTheme, normalizeTheme } from "../lib/themes";
import { bgImages } from "../lib/assets";

const log = makeLog("background");

const siteUrl = process.env.SITE_URL;

let customBackgrounds = {};

const init = () => {
  browser.browserAction.onClicked.addListener(() => {
    queryAndFocusTab("fromAddon=true");
  });
  browser.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(messageListener(port));
    port.postMessage({ type: "hello" });
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

// Blank 1x1 PNG from http://png-pixel.com/
const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const applyTheme = ({ theme }) => {
  log("applyTheme", theme);
  if (!theme) {
    return;
  }

  const newTheme = convertToBrowserTheme(theme, bgImages, customBackgrounds);

  // the headerURL is required in < 60,
  // but it creates an ugly text shadow.
  // So only add it for older FFs only.
  const fxVersion = navigator.userAgent.toLowerCase().split("firefox/")[1];
  if (fxVersion < 60) {
    newTheme.images.headerURL = BLANK_IMAGE;
  }

  browser.theme.update(newTheme);
};

init();
