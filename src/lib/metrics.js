import TestPilotGA from "testpilot-ga";

// Use of package.json for configuration
import packageMeta from "../../package.json";

import { DEBUG, makeLog } from "./utils";
import { selectors } from "./store";
import { colorsWithAlpha } from "./constants";

const log = makeLog("metrics");

let analytics = null;

// Time after which to consider add-on install to have failed, because we have
// no good way to tell if the install has been cancelled - only if the add-on
// becomes available
const INSTALL_FAILURE_DELAY = 10 * 1000;
let installTimer = null;

// See also: https://github.com/mozilla/Themer/blob/master/docs/metrics.md

// Custom metrics
let cm1; // integer count of select-full events from start of visit
let cm2; // integer count of select-bg events from start of visit
let cm3; // integer count of select-color events from start of visit

// Custom dimensions
let cd1; // does the user have the add-on installed. One of true or false
let cd2; // did this visit originate from an add-on click. One of true or false
let cd3; // did the user receive a theme as a query parameter. One of true or
// false
let cd4; // engaged with any theme-change event. One of true or false based on
// whether user has fired any theme-change during their visit.
let cd5; // hsla (csv) of the toolbar
let cd6; // hsl (csv) of the toolbar_text
let cd7; // hsl (csv) of the accentcolor
let cd8; // hsl (csv) of the textcolor
let cd9; // hsla (csv) of the toolbar_field
let cd10; // hsl (csv) of the toolbar_field_text
let cd11; // unique integer id of the background pattern selected

const COLORS_TO_DIMENSIONS = {
  toolbar: "cd5",
  toolbar_text: "cd6",
  accentcolor: "cd7",
  textcolor: "cd8",
  toolbar_field: "cd9",
  toolbar_field_text: "cd10"
};

const hslaToCSV = (name, { h, s, l, a }) =>
  `${h},${s},${l}${colorsWithAlpha.includes(name) ? `,${a}` : ""}`;

const Metrics = {
  init(appContext = "web") {
    /* eslint-disable prefer-destructuring */
    analytics = new TestPilotGA({
      aid: packageMeta.extensionManifest.applications.gecko.id,
      an: packageMeta.extensionManifest.name,
      av: packageMeta.version,
      ds: appContext,
      tid: packageMeta.config.GA_TRACKING_ID,
      // TODO: add some env vars or use window.location to determine local / dev / stage / prod?
      cd19: DEBUG ? "dev" : "production"
    });
    /* eslint-enable prefer-destructuring */

    cm1 = 0;
    cm2 = 0;
    cm3 = 0;
    cd1 = false;
    cd2 = false;
    cd3 = false;
    cd4 = false;
  },

  sendEvent(...params) {
    if (analytics) {
      analytics.sendEvent(...params);
    }
  },

  storeMiddleware() {
    return ({ getState }) => next => action => {
      const result = next(action);

      if (action.type === "SET_THEME") {
        const theme = selectors.theme(getState());
        this.setTheme(theme);
        if (action.meta && action.meta.userEdit) {
          this.setThemeChanged(true);
        }
      }

      return result;
    };
  },

  setHasAddon(value) {
    cd1 = value;
  },

  setWasAddonClick(value) {
    cd2 = value;
  },

  setReceivedTheme(value) {
    cd3 = value;
  },

  setThemeChanged(value) {
    cd4 = value;
  },

  themeToDimensions({ colors, images }) {
    const bgImage = images.additional_backgrounds
      ? images.additional_backgrounds[0]
      : "";
    return Object.entries(colors).reduce(
      (acc, [name, hsla]) => ({
        ...acc,
        [COLORS_TO_DIMENSIONS[name]]: hslaToCSV(name, hsla)
      }),
      { cd11: bgImage }
    );
  },

  setTheme(theme) {
    const themeDimensions = this.themeToDimensions(theme);
    log("update theme", themeDimensions);
    ({ cd5, cd6, cd7, cd8, cd9, cd10, cd11 } = themeDimensions);
  },

  installStart() {
    if (installTimer) {
      clearTimeout(installTimer);
    }
    installTimer = setTimeout(() => {
      this.installFailure();
    }, INSTALL_FAILURE_DELAY);

    this.sendEvent("install-addon", "button-click", {
      el: "install-trigger",
      cm1,
      cm2,
      cm3,
      cd3,
      cd4,
      cd5,
      cd6,
      cd7,
      cd8,
      cd9,
      cd10,
      cd11
    });
  },

  installFailure() {
    this.sendEvent("install-addon", "poll-event", {
      el: "install-fail"
    });
  },

  installSuccess() {
    if (!installTimer) {
      // Skip this event if there's no install timer in progress.
      return;
    }
    clearTimeout(installTimer);
    this.sendEvent("install-addon", "poll-event", {
      el: "install-success"
    });
  },

  themeChangeFull(themeId) {
    cm1++;
    this.setThemeChanged(true);
    this.sendEvent("theme-change", "select-full", {
      el: themeId,
      cm1,
      cm2,
      cm3,
      cd1,
      cd2
    });
  },

  themeChangeBackground(backgroundId) {
    cm2++;
    this.setThemeChanged(true);
    this.sendEvent("theme-change", "select-background", {
      el: backgroundId,
      cm1,
      cm2,
      cm3,
      cd1,
      cd2,
      cd3,
      cd11
    });
  },

  themeChangeColor(colorName) {
    cm3++;
    this.setThemeChanged(true);
    this.sendEvent("theme-change", "select-color", {
      el: colorName,
      cm1,
      cm2,
      cm3,
      cd1,
      cd2,
      cd3
    });
  },

  shareClick() {
    this.sendEvent("share-engagement", "button-click", {
      cm1,
      cm2,
      cm3,
      cd1,
      cd2,
      cd3,
      cd4,
      cd5,
      cd6,
      cd7,
      cd8,
      cd9,
      cd10,
      cd11
    });
  },

  linkClick(el) {
    // if el === download-firefox, add the following dimensions to this event
    const downloadFirefoxDimensions =
      el !== "download-firefox" ? {} : { cd5, cd6, cd7, cd8, cd9, cd10, cd11 };
    this.sendEvent("link-engagement", "click", {
      el,
      cm1,
      cm2,
      cm3,
      cd1,
      cd2,
      cd3,
      cd4,
      ...downloadFirefoxDimensions
    });
  },

  receiveTheme(action, theme) {
    this.sendEvent("receive-theme", "button-click", {
      el: action,
      cd1,
      ...this.themeToDimensions(theme)
    });
  },

  finishVisit() {
    this.sendEvent("finish-visit", "leave", {
      cm2,
      cm3,
      cd1,
      cd2,
      cd3,
      cd4,
      cd5,
      cd6,
      cd7,
      cd8,
      cd9,
      cd10,
      cd11
    });
  }
};

export default Metrics;
