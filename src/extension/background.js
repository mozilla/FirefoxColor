import { applyMiddleware } from 'redux';

import { CHANNEL_NAME } from '../lib/constants';
import { createAppStore, selectors, makeActions } from '../lib/store';
import { colorToCSS } from '../lib/utils';

const actions = makeActions({ context: 'extension' });

const ports = new Set();

const relayToContentMiddleware = store => next => action => {
  const result = next(action);
  if (action.meta.context === 'extension') {
    // Only relay actions that came from our extension context.
    ports.forEach(port => port.postMessage({ type: 'storeAction', action }));
  }
  return result;
};

const updateStoreMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  if (!action.meta.loadState) {
    // Only update storage if this action didn't come from store loading
    const theme = selectors.theme(getState());
    browser.storage.local.set({ theme });
  }
  return returnValue;
};

const store = createAppStore(
  {},
  applyMiddleware(relayToContentMiddleware, updateStoreMiddleware)
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

const loadTheme = () => {
  browser.storage.local.get('theme').then(({ theme }) => {
    const action = actions.theme.setTheme({ theme });
    action.meta.loadTheme = true;
    store.dispatch(action);
  });
};

browser.runtime.onConnect.addListener(port => {
  ports.add(port);
  port.onDisconnect.addListener(() => ports.delete(port));
  port.onMessage.addListener(({ type, action }) => {
    if (type === 'storeAction' && action.meta.context === 'web') {
      // Only accept related actions from web context.
      store.dispatch(action);
    }
    if (type === 'loadTheme') {
      loadTheme();
    }
    if (type === 'ping') {
      port.postMessage({ type: 'pong' });
    }
  });
});

loadTheme();
