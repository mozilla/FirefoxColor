import React from 'react';
import { compose, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import queryString from 'query-string';

import { CHANNEL_NAME, defaultColors } from '../lib/constants';
import { createAppStore, selectors } from '../lib/store';
import App from './lib/components/App';

import './index.scss';

const jsonCodec = JsonUrl('lzma');

const params = queryString.parse(location.search);
if (!params.state) {
  init();
} else {
  jsonCodec
    .decompress(params.state)
    .then(state => {
      const { theme, ui } = state;
      init({ theme, ui });
    })
    .catch(() => init());
}

window.addEventListener('message', event => {
  if (
    event.source === window &&
    event.data &&
    event.data.channel === `${CHANNEL_NAME}-web`
  ) {
    if (event.data.type === 'init') {
    }
  }
});

const relayToExtensionMiddleware = store => next => action => {
  const result = next(action);
  // Only relay actions that came from our web context.
  if (action.meta.context === 'web') {
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

function init(initialState) {
  const composeEnhancers = composeWithDevTools({
  });

  const store = createAppStore(
    initialState,
    composeEnhancers(applyMiddleware(relayToExtensionMiddleware))
  );

  store.subscribe(() => {
    const state = store.getState();
    jsonCodec.compress(state).then(value => {
      const { protocol, host, pathname } = window.location;
      window.history.replaceState(
        state,
        '',
        `${protocol}//${host}${pathname}?state=${value}`
      );
    });
  });

  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  );
}
