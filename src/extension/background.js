import { makeLog } from "../lib/utils";
import {
  normalizeTheme,
  normalizeThemeBackground,
  colorToCSS,
  bgImages
} from "../lib/themes";

// Blank 1x1 PNG from http://png-pixel.com/
const BLANK_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

const log = makeLog("background");

const siteUrl = process.env.SITE_URL;

const init = () => {
  browser.browserAction.onClicked.addListener(() => {
    browser.tabs.query({ currentWindow: true }).then(tabs => {
      const themerTab = tabs.find(tab => tab.url.includes(siteUrl));
      if (themerTab) {
        browser.tabs.update(themerTab.id, { active: true });
      } else {
        browser.tabs.create({ url: siteUrl });
      }
    });
  });
  browser.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(messageListener(port));
    port.postMessage({ type: "hello" });
  });
  fetchTheme().then(applyTheme);
};

const messageListener = port => message => {
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
    case "ping":
      port.postMessage({ type: "pong" });
      break;
    default:
      log("unexpected message", message);
  }
};

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

  browser.theme.update(newTheme);
};

browser.windows.onCreated.addListener(() => {
  fetchTheme().then(applyTheme);
});

init();
