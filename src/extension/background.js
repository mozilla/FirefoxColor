import { applyMiddleware } from 'redux';

import { defaultColors } from '../lib/constants';
import { createAppStore, selectors, makeActions } from '../lib/store';
import { colorToCSS } from '../lib/utils';

const actions = makeActions({ context: 'extension' });

const ports = [];

const relayToContentMiddleware = store => next => action => {
  const result = next(action);
  // Only relay actions that came from our extension context.
  if (action.meta.context === 'extension') {
    window.postMessage(
      {
        channel: `${CHANNEL_NAME}-background`,
        type: 'storeAction',
        action
      },
      '*'
    );
  }
  return result;
};

const store = createAppStore(
  {},
  applyMiddleware(relayToContentMiddleware)
);

store.subscribe(() => {
  const state = store.getState();

  const newTheme = {
    images: {
      headerURL: 'images/bg-0.png',
      additional_backgrounds: ['bg-0.png']
    },
    properties: {
      additional_backgrounds_alignment: ['top'],
      additional_backgrounds_tiling: ['repeat']
    },
    colors: {}
  };

  const theme = selectors.theme(state);
  for (let key in theme.colors) {
    newTheme.colors[key] = colorToCSS(theme.colors[key]);
  }

  browser.theme.update(newTheme);
});

browser.runtime.onConnect.addListener(port => {
  ports.push(port);
  // port.postMessage({ type: 'init', colors, background });
  port.onMessage.addListener(message => {
    if (message.type === 'storeAction') {
      const action = message.action;
      if (action.meta.context === 'web') {
        // Only accept related actions from web context.
        store.dispatch(action);
      }
    }
  });
});

/*
const getThemeFromStorage = browser.storage.local.get();

getThemeFromStorage.then((store) => {
  if (typeof store.colors === 'undefined') {
    for (const color of defaultColors) {
      colors.push(color);
    }
  } else {
    for (const color of store.colors) {
      colors.push(color);
      background = store.background; // eslint-disable-line prefer-destructuring
    }
  }
  updateTheme();
  setTheme();
});
*/
