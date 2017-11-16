import { makeLog, colorToCSS } from '../lib/utils';

const log = makeLog('background');

const bgImages = require.context('../images/', false, /bg-.*\.png/);

const init = () => {
  browser.browserAction.onClicked.addListener(() =>
    browser.tabs.create({ url: 'editor.html' })
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
  setTheme: ({ message: { theme } }) => {
    log('setTheme', theme);
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
  const backgroundImage = bgImages.keys().includes(theme.images.headerURL)
    ? bgImages(theme.images.headerURL)
    : 'images/bg-0.png';

  const newTheme = {
    images: {
      headerURL: backgroundImage,
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

  return browser.theme.update(newTheme);
};

init();
