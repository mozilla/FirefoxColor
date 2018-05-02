/* global JsonUrl */

import React from "react";
import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { render } from "react-dom";
import { Provider } from "react-redux";
import queryString from "query-string";
import Clipboard from "clipboard";

import { makeLog } from "../lib/utils";
import { CHANNEL_NAME, loaderQuotes } from "../lib/constants";
import {
  createAppStore,
  actions,
  selectors,
  themeChangeActions
} from "../lib/store";
import Metrics from "../lib/metrics";

import App from "./lib/components/App";
import storage from "./lib/storage";

import "./index.scss";

const log = makeLog("web");

const clipboard = new Clipboard(".clipboardButton");

const addonUrl = process.env.ADDON_URL;

// Period after which app loading indicator will disappear if add-on not found
// If dev show right away to make debugging faster
const LOADER_DELAY_PERIOD = process.env.NODE_ENV === "development" ? 0 : 2000;
const PING_PERIOD = 1000;
const MAX_OUTSTANDING_PINGS = 3;
let outstandingPings = 0;

const jsonCodec = JsonUrl("lzma");

const urlEncodeTheme = theme =>
  jsonCodec.compress(theme).then(value => {
    const { protocol, host, pathname } = window.location;
    return `${protocol}//${host}${pathname}?theme=${value}`;
  });

const urlDecodeTheme = themeString => jsonCodec.decompress(themeString);

const postMessage = (type, data = {}) =>
  window.postMessage(
    { ...data, type, channel: `${CHANNEL_NAME}-extension` },
    "*"
  );

const updateExtensionThemeMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  const meta = action.meta || {};
  if (!meta.skipAddon && themeChangeActions.includes(action.type)) {
    postMessage("setTheme", { theme: selectors.theme(getState()) });
  }
  return returnValue;
};

const updateHistoryMiddleware = ({ getState }) => next => action => {
  const returnValue = next(action);
  const meta = action.meta || {};
  if (!meta.skipHistory && themeChangeActions.includes(action.type)) {
    const theme = selectors.theme(getState());
    urlEncodeTheme(theme).then(url =>
      window.history.pushState({ theme }, "", url)
    );
  }
  return returnValue;
};

const composeEnhancers = composeWithDevTools({});

const store = createAppStore(
  {},
  composeEnhancers(
    applyMiddleware(
      updateExtensionThemeMiddleware,
      updateHistoryMiddleware,
      Metrics.storeMiddleware()
    )
  )
);

storage.init(store);
Metrics.init();

window.addEventListener("popstate", ({ state: { theme } }) =>
  store.dispatch({
    ...actions.theme.setTheme({ theme }),
    meta: { skipHistory: true }
  })
);

window.addEventListener("message", ({ source, data: message }) => {
  if (
    source === window &&
    message &&
    message.channel === `${CHANNEL_NAME}-web`
  ) {
    if (message.type === "hello" || message.type === "pong") {
      outstandingPings = 0;
      const hasExtension = selectors.hasExtension(store.getState());
      if (!hasExtension) {
        store.dispatch(actions.ui.setHasExtension({ hasExtension: true }));
        Metrics.installSuccess();
        postMessage("setTheme", { theme: selectors.theme(store.getState()) });
      }
    }
    if (message.type === "fetchedTheme") {
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
  postMessage("ping");
  const hasExtension = selectors.hasExtension(store.getState());
  if (hasExtension) {
    outstandingPings++;
    if (outstandingPings >= MAX_OUTSTANDING_PINGS) {
      store.dispatch(actions.ui.setHasExtension({ hasExtension: false }));
    }
  }
}, PING_PERIOD);

const userAgent = navigator.userAgent.toLowerCase();
const isMobile = userAgent.includes("mobi") || userAgent.includes("tablet");
const isFirefox = userAgent.includes("firefox/") && !userAgent.includes("fxios");
const loaderQuote = loaderQuotes[Math.floor(Math.random() * loaderQuotes.length)];

render(
  <Provider store={store}>
    <App {...{
      addonUrl,
      urlEncodeTheme,
      clipboard,
      storage,
      isMobile,
      isFirefox,
      loaderQuote
    }} />
  </Provider>,
  document.getElementById("root")
);

/**
 * We display a loading indicator on startup that overlays the rest of the app.
 * Several Redux state changes happen immediately after startup.
 *
 * We set up a timer that re-starts with each state change. Once no more state
 * changes come and that timer expires, we consider loading done and dismiss
 * the indicator.
 */
const unsubscribeLoader = store.subscribe(() => {
  if (selectors.loaderDelayExpired(store.getState())) {
    // State settled down long enough for timer to expire - stop listening.
    unsubscribeLoader();
  } else {
    // Reset the timer again.
    startLoaderDelay();
  }
});

// Utility to (re)start up a timer to dismiss the loading indicator
let loaderTimer = null;
function startLoaderDelay() {
  if (loaderTimer) {
    clearTimeout(loaderTimer);
  }
  loaderTimer = setTimeout(
    () => store.dispatch(actions.ui.setLoaderDelayExpired(true)),
    LOADER_DELAY_PERIOD
  );
}

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
if (params.fromAddon) {
  Metrics.setWasAddonClick(true);
}
if (!params.theme) {
  // Fire off a message to request current theme from the add-on.
  postMessage("fetchTheme");
  // The add-on may never answer, so start the loader delay.
  startLoaderDelay();
} else {
  log("Received shared theme");
  urlDecodeTheme(params.theme)
    .then(theme => {
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
      // Set the pending theme - only matters if add-on is installed
      store.dispatch(actions.ui.setPendingTheme({ theme }));
      // Fire off a message to request current theme from the add-on.
      postMessage("fetchTheme");
    })
    // If the theme decoding fails, just ignore it.
    .catch(() => postMessage("fetchTheme"));
}
