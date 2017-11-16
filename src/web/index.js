/* global JsonUrl */

import React from 'react';
import { applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';

// import { makeLog } from '../lib/utils';
import { CHANNEL_NAME } from '../lib/constants';
import { createAppStore, actions, selectors } from '../lib/store';
import App from './lib/components/App';

import './index.scss';

// const log = makeLog('web');

const PING_PERIOD = 1000;
const MAX_OUTSTANDING_PINGS = 2;
let outstandingPings = 0;

const jsonCodec = JsonUrl('lzma');

const postMessage = (type, data = {}) =>
  window.postMessage(
    { ...data, type, channel: `${CHANNEL_NAME}-extension` },
    '*'
  );

const updateExtensionThemeMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  postMessage('setTheme', { theme: selectors.theme(getState()) });
  return returnValue;
};

const updateHistoryMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  if (!action.meta || !action.meta.popstate) {
    // Only update history if this action wasn't from popstate event.
    const theme = selectors.theme(getState());
    jsonCodec.compress(theme).then(value => {
      const { protocol, host, pathname } = window.location;
      window.history.pushState(
        { theme },
        '',
        `${protocol}//${host}${pathname}?theme=${value}`
      );
    });
  }
  return returnValue;
};

const composeEnhancers = composeWithDevTools({});

const store = createAppStore(
  {},
  composeEnhancers(
    applyMiddleware(updateExtensionThemeMiddleware, updateHistoryMiddleware)
  )
);

window.addEventListener('popstate', ({ state: { theme } }) =>
  store.dispatch({
    ...actions.theme.setTheme({ theme }),
    meta: { popstate: true }
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
      store.dispatch(actions.theme.setTheme({ theme: message.theme }));
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
    <App />
  </Provider>,
  document.getElementById('root')
);

const params = queryString.parse(window.location.search);
if (!params.theme) {
  postMessage('fetchTheme');
} else {
  jsonCodec.decompress(params.theme).then(theme => {
    store.dispatch(actions.theme.setTheme({ theme }));
  });
}
