import { makeLog, colorToCSS, normalizeTheme } from '../lib/utils';

// Blank 1x1 PNG from http://png-pixel.com/
const BLANK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

const log = makeLog('background');

const bgImages = require.context('../images/', false, /bg-.*\.png/);

const siteUrl = process.env.SITE_URL;

const init = () => {
  browser.browserAction.onClicked.addListener(() =>
    browser.tabs.create({ url: siteUrl })
  );
  browser.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(
      message =>
        message.type in messageHandlers &&
        messageHandlers[message.type]({ port, message })
    );
    port.postMessage({ type: 'hello' });
  });
  fetchTheme().then(applyTheme);
};

const messageHandlers = {
  fetchTheme: ({ port }) => {
    log('fetchTheme');
    fetchTheme().then(({ theme }) =>
      port.postMessage({ type: 'fetchedTheme', theme })
    );
  },
  setTheme: ({ message: { theme: themeIn } }) => {
    log('setTheme', themeIn);
    const theme = normalizeTheme(themeIn);
    storeTheme({ theme });
    applyTheme({ theme });
  },
  ping: ({ port }) => {
    port.postMessage({ type: 'pong' });
  }
};

const fetchTheme = () => browser.storage.local.get('theme');

const storeTheme = ({ theme }) => browser.storage.local.set({ theme });

const applyTheme = ({ theme }) => {
  log('applyTheme', theme);
  if (!theme) { return; }

  const backgroundImage = bgImages.keys().includes(theme.images.headerURL)
    ? bgImages(theme.images.headerURL)
    : 'images/bg-0.png';

  const newTheme = {
    images: {
      // HACK: use a transparent pixel image for headerURL - because headerURL
      // won't tile but additional_backgrounds won't appear without it.
      headerURL: BLANK_IMAGE,
      additional_backgrounds: [backgroundImage]
    },
    properties: {
      additional_backgrounds_alignment: ['top'],
      additional_backgrounds_tiling: ['repeat']
    },
    colors: {}
  };

  Object.keys(theme.colors).forEach(key => {
    newTheme.colors[key] = colorToCSS(theme.colors[key]);
  });

  browser.theme.update(newTheme);
};

browser.windows.onCreated.addListener(() => {
  fetchTheme().then(applyTheme);
});

init();
