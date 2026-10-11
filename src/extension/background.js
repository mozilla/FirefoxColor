import { makeLog } from "../lib/utils";
import { convertToBrowserTheme, normalizeTheme } from "../lib/themes";
import { bgImages } from "../lib/assets";

const log = makeLog("background");

const siteUrl = process.env.SITE_URL;

let customBackgrounds = {};

let isThemePreview = false;

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

const SYSTEM_SCHEME_KEYS = [
  "lightThemeUrl",
  "darkThemeUrl",
  "lightTheme",
  "darkTheme"
];

// True while a light and a dark theme are both configured in the options page
// and the applied theme follows the system color scheme.
let followSystemScheme = false;

const extensionVersion = browser.runtime.getManifest().version;

const init = () => {
  browser.browserAction.onClicked.addListener(() => {
    queryAndFocusTab("fromAddon=true");
  });
  browser.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(messageListener(port));
    port.postMessage({ type: "hello", extensionVersion });
    port.onDisconnect.addListener(() => {
      if (isThemePreview) {
        isThemePreview = false;
        applyCurrentTheme();
      }
    });
  });
  darkQuery.addEventListener("change", () => {
    if (followSystemScheme && !isThemePreview) {
      applyCurrentTheme();
    }
  });
  browser.storage.onChanged.addListener((changes, area) => {
    if (
      area === "local" &&
      !isThemePreview &&
      ("lightTheme" in changes || "darkTheme" in changes)
    ) {
      fetchSchemeTheme().then(({ theme }) =>
        theme ? applyTheme({ theme }) : browser.theme.reset()
      );
    }
  });
  fetchFirstRunDone().then(({ firstRunDone }) => {
    log("firstRunDone", firstRunDone);
    if (firstRunDone) {
      fetchImages()
        .then(({ images }) => {
          customBackgrounds = images || {};
          return fetchSchemeTheme();
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
  revertAll: message => {
    log("revertAllThemes", message);
    storeTheme({ theme: null });
    browser.storage.local.remove(SYSTEM_SCHEME_KEYS);
    queryAndFocusTab("", true);
    browser.theme.reset();
  },
  setTheme: message => {
    const theme = normalizeTheme(message.theme);
    log("setTheme", theme);
    storeTheme({ theme });
    applyTheme({ theme });
  },
  previewTheme: ({ theme }) => {
    log("previewTheme", theme);
    if (theme) {
      const previewTheme = normalizeTheme(theme);
      applyTheme({ theme: previewTheme });
      isThemePreview = true;
    } else {
      applyCurrentTheme();
      isThemePreview = false;
    }
  },
  ping: (message, port) => {
    port.postMessage({ type: "pong", extensionVersion });
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
    const siteTab = tabs.find(tab => tab.url.startsWith(siteUrl));
    if (siteTab) {
      const tabUrl = new URL(siteTab.url);
      if (reload) {
        browser.tabs.update(siteTab.id, {
          active: true,
          url: `${siteUrl}${
            tabUrl.search ? tabUrl.search + "&" : "?"
          }${params}${tabUrl.hash}`
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

// When both a light and a dark theme are configured in the options page, the
// theme follows the system color scheme. Otherwise, use the stored theme.
const fetchSchemeTheme = () =>
  browser.storage.local
    .get(["theme", "lightTheme", "darkTheme"])
    .then(({ theme, lightTheme, darkTheme }) => {
      followSystemScheme = !!(lightTheme && darkTheme);
      if (!followSystemScheme) {
        return { theme };
      }
      return { theme: darkQuery.matches ? darkTheme : lightTheme };
    });

// Unlike the storage change handler, this does not reset the browser theme
// when no theme is stored; it is only used to restore the current theme.
const applyCurrentTheme = () => fetchSchemeTheme().then(applyTheme);

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

  if (followSystemScheme) {
    // Keep the browser's own color scheme following the OS, so the media query
    // above reflects the system and not the theme being applied.
    newTheme.properties.color_scheme = "system";
  }

  // the headerURL is required in < 60,
  // but it creates an ugly text shadow.
  // So only add it for older FFs only.
  const fxVersion = navigator.userAgent.toLowerCase().split("firefox/")[1];
  if (fxVersion < 60) {
    newTheme.images.headerURL = BLANK_IMAGE;
  }

  browser.theme.update(newTheme).catch(() => {
    // Firefox < 106 does not know the color_scheme property.
    if (newTheme.properties.color_scheme) {
      delete newTheme.properties.color_scheme;
      browser.theme.update(newTheme);
    }
  });
};

init();
