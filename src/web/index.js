import React from 'react';
import { compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';

import { CHANNEL_NAME } from '../lib/constants';
import { createAppStore, makeActions, selectors } from '../lib/store';
import App from './lib/components/App';

import './index.scss';

const PING_PERIOD = 1000;
const MAX_OUTSTANDING_PINGS = 2;
let outstandingPings = 0;

const jsonCodec = JsonUrl('lzma');

const actions = makeActions({ context: 'web' });

const postMessage = (type, data = {}) =>
  window.postMessage(
    { ...data, type, channel: `${CHANNEL_NAME}-extension` },
    '*'
  );

const composeEnhancers = composeWithDevTools({});

const relayToExtensionMiddleware = store => next => action => {
  const returnValue = next(action);
  if (action.meta.context === 'web') {
    // Only relay actions that came from our web context.
    postMessage('storeAction', { action });
  }
  return returnValue;
};

const updateHistoryMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  if (!action.meta.popstate) {
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

const store = createAppStore(
  {},
  composeEnhancers(
    applyMiddleware(relayToExtensionMiddleware, updateHistoryMiddleware)
  )
);

window.addEventListener('popstate', ({ state: { theme } }) => {
  const action = actions.theme.setTheme({ theme });
  action.meta.popstate = true;
  store.dispatch(action);
});


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
    if (message.type === 'storeAction') {
      const action = message.action;
      if (action.meta.context === 'extension') {
        // Only accept relayed actions from extension context
        store.dispatch(action);
      }
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

const params = queryString.parse(location.search);
if (params.theme) {
  jsonCodec.decompress(params.theme).then(theme => {
    store.dispatch(actions.theme.setTheme({ theme }));
  });
} else {
  postMessage('loadTheme');
}
