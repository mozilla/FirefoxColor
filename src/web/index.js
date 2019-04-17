/* global JsonUrl, import */

import React from "react";
import { applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import promiseMiddleware from "redux-promise";
import { render } from "react-dom";
import { Provider } from "react-redux";
import queryString from "query-string";
import Clipboard from "clipboard";

import { makeLog } from "../lib/utils";
import { CHANNEL_NAME, loaderQuotes } from "../lib/constants";
import { normalizeTheme } from "../lib/themes";
import { createAppStore, actions, selectors } from "../lib/store";

import setupMiddleware from "./lib/middleware";
import storage from "./lib/storage";
import { bgImages } from "../lib/assets";

import App from "./lib/components/App";

import "./index.scss";

const log = makeLog("web");

log("startup");

const clipboard = new Clipboard(".clipboardButton");

const addonUrl = process.env.ADDON_URL;

// Period after which app loading indicator will disappear if add-on not found
// Default (2000) found in webpack.common.js
const LOADER_DELAY_PERIOD = process.env.LOADER_DELAY_PERIOD;
const PING_PERIOD = 1000;
const MAX_OUTSTANDING_PINGS = 7;
let outstandingPings = 0;

const jsonCodec = JsonUrl("lzma");

const urlEncodeTheme = ({ hasCustomBackgrounds = false, theme }) => {
  const { protocol, host, pathname } = window.location;
  const baseUrl = `${protocol}//${host}${pathname}`;
  return hasCustomBackgrounds
    ? Promise.resolve(baseUrl)
    : jsonCodec
        .compress(normalizeTheme(theme))
        .then(value => `${baseUrl}?theme=${value}`);
};

const urlDecodeTheme = themeString => jsonCodec.decompress(themeString);

const postMessage = (type, data = {}) =>
  window.postMessage(
    { ...data, type, channel: `${CHANNEL_NAME}-extension` },
    "*"
  );

const composeEnhancers = composeWithDevTools({});

const store = createAppStore(
  {},
  composeEnhancers(
    applyMiddleware(
      promiseMiddleware,
      ...setupMiddleware({ postMessage, urlEncodeTheme, storage })
    )
  )
);

storage.init(store);

window.addEventListener("popstate", ({ state: { theme } }) =>
  store.dispatch({
    ...actions.theme.setTheme({ theme }),
    meta: {
      skipHistory: true,
      userEdit: true
    }
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
        const state = store.getState();
        postMessage("addImages", {
          images: selectors.themeCustomImages(state)
        });
        postMessage("setTheme", { theme: selectors.theme(state) });
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
const isFirefox =
  userAgent.includes("firefox/") && !userAgent.includes("fxios");
const loaderQuote =
  loaderQuotes[Math.floor(Math.random() * loaderQuotes.length)];

const performThemeExport = args =>
  import(/* webpackChunkName: "./lib/export" */ "./lib/export").then(
    ({ default: perform }) => perform({ ...args, store, bgImages })
  );

render(
  <Provider store={store}>
    <App
      {...{
        addonUrl,
        urlEncodeTheme,
        clipboard,
        storage,
        isMobile,
        isFirefox,
        loaderQuote,
        performThemeExport
      }}
    />
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
if (params.firstRun) {
  store.dispatch(actions.ui.setFirstRun(true));
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
          // This is an automatic change, not a user edit
          userEdit: false,
          // Skip updating history for this theme, because it came from the URL
          skipHistory: true,
          // Skip updating the add-on for this theme, because it needs approval
          skipAddon: true
        }
      });
      // Set the pending theme - only matters if add-on is installed
      store.dispatch(actions.ui.setPendingTheme({ theme }));
      // Fire off a message to request current theme from the add-on.
      if (!params.firstRun) {
        postMessage("fetchTheme");
      } else {
        postMessage("setTheme", { theme });
      }
    })
    // If the theme decoding fails, just ignore it.
    .catch(e => {
      log("Theme decoding failed", e);
      postMessage("fetchTheme");
    });
}
