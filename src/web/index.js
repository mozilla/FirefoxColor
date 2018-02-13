/* global JsonUrl */

import React from 'react';
import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';
import Clipboard from 'clipboard';

import { makeLog } from '../lib/utils';
import { CHANNEL_NAME } from '../lib/constants';
import { createAppStore, actions, selectors, themeChangeActions } from '../lib/store';
import App from './lib/components/App';

import './index.scss';

const log = makeLog('web');

const clipboard = new Clipboard('.clipboardButton');

const addonUrl = process.env.ADDON_URL;

const PING_PERIOD = 1000;
const MAX_OUTSTANDING_PINGS = 2;
let outstandingPings = 0;

const jsonCodec = JsonUrl('lzma');

const urlEncodeTheme = theme =>
  jsonCodec.compress(theme).then(value => {
    const { protocol, host, pathname } = window.location;
    return `${protocol}//${host}${pathname}?theme=${value}`;
  });

const urlDecodeTheme = themeString =>
  jsonCodec.decompress(themeString);

const postMessage = (type, data = {}) =>
  window.postMessage(
    { ...data, type, channel: `${CHANNEL_NAME}-extension` },
    '*'
  );

const updateExtensionThemeMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  const meta = action.meta || {};
  if (!meta.skipAddon && themeChangeActions.includes(action.type)) {
    postMessage('setTheme', { theme: selectors.theme(getState()) });
  }
  return returnValue;
};

const updateHistoryMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  const meta = action.meta || {};
  if (!meta.skipHistory && themeChangeActions.includes(action.type)) {
    const theme = selectors.theme(getState());
    urlEncodeTheme(theme).then(url =>
      window.history.pushState({ theme }, '', url));
  }
  return returnValue;
};

const composeEnhancers = composeWithDevTools({});

const store = createAppStore(
  {},
  composeEnhancers(
    applyMiddleware(
      updateExtensionThemeMiddleware,
      updateHistoryMiddleware
    )
  )
);

window.addEventListener('popstate', ({ state: { theme } }) =>
  store.dispatch({
    ...actions.theme.setTheme({ theme }),
    meta: { skipHistory: true }
  })
);

window.addEventListener('message', ({ source, data: message }) => {
  if (
    source === window &&
    message &&
    message.channel === `${CHANNEL_NAME}-web`
  ) {
    if (message.type === 'hello' || message.type === 'pong') {
      outstandingPings = 0;
      const hasExtension = selectors.hasExtension(store.getState());
      if (!hasExtension) {
        store.dispatch(actions.ui.setHasExtension({ hasExtension: true }));
      }
    }
    if (message.type === 'fetchedTheme') {
      store.dispatch({
        ...actions.theme.setTheme({ theme: message.theme }),
        meta: { fromAddon: true }
      });
    }
  }
});

// Periodicelly ping the extension to detect install / uninstall, since we have
// no access to mozAddonManager.
setInterval(() => {
  postMessage('ping');
  const hasExtension = selectors.hasExtension(store.getState());
  if (hasExtension) {
    outstandingPings++;
    if (outstandingPings >= MAX_OUTSTANDING_PINGS) {
      store.dispatch(actions.ui.setHasExtension({ hasExtension: false }));
    }
  }
}, PING_PERIOD);

render(
  <Provider store={store}>
    <App {...{ addonUrl, urlEncodeTheme, clipboard }} />
  </Provider>,
  document.getElementById('root')
);

/**
 * Some notes on the startup flow, here:
 *
 * If there's no ?theme param, just ask for a current theme from the add-on. If
 * the add-on is not installed, this does nothing.
 *
 * If there is a ?theme param, that's considered a theme shared with the user.
 * The shared theme is stored as "pending" and also loaded up into the editor.
 * The add-on is then also asked for a current theme.
 *
 * If the add-on never responds with a current theme, the shared theme just
 * appears in the editor.
 *
 * If the add-on is installed and responds with a current theme, then that
 * current theme is loaded into the editor.
 *
 * If the shared theme is not identical to the current theme, the "pending"
 * shared theme is pressented in an approval dialog with a preview (i.e.
 * SharedThemeDialog). From there, the user can apply the shared theme to
 * override the current theme or skip it and discard.
 *
 * For more details on this flow, check out src/lib/store.js - pay particular
 * attention to the logic involved in the shouldOfferPendingTheme selector.
 */

const params = queryString.parse(window.location.search);
if (!params.theme) {
  // Fire off a message to request current theme from the add-on.
  postMessage('fetchTheme');
} else {
  log('Received shared theme');
  urlDecodeTheme(params.theme).then(theme => {
    // Set the pending theme - only matters if add-on is installed
    store.dispatch(actions.ui.setPendingTheme({ theme }));
    // Set the current editor theme - but skip history & add-on updates
    store.dispatch({
      ...actions.theme.setTheme({ theme }),
      meta: {
        // Skip updating history for this theme, because it came from the URL
        skipHistory: true,
        // Skip updating the add-on for this theme, because it needs approval
        skipAddon: true
      }
    });
    // Fire off a message to request current theme from the add-on.
    postMessage('fetchTheme');
  });
}
