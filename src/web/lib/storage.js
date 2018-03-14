import { actions } from "../../lib/store";
import { makeLog } from "../../lib/utils";
import { normalizeTheme } from "../../lib/themes";

const log = makeLog("web.storage");

const THEME_STORAGE_PREFIX = "THEME-";

const themeStorageKey = key => `${THEME_STORAGE_PREFIX}${key}`;

const isThemeStorageKey = key => key.indexOf(THEME_STORAGE_PREFIX) === 0;

const themeKeyFromStorage = storageKey =>
  storageKey.substr(THEME_STORAGE_PREFIX.length);

const generateThemeKey = () =>
  `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

function putTheme(key, theme) {
  log("putTheme", key, theme);
  const storageKey = themeStorageKey(key);
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      theme,
      modified: Date.now()
    })
  );
  notifySelfForStorage(storageKey);
}

function deleteTheme(key) {
  log("deleteTheme", key);
  const storageKey = themeStorageKey(key);
  localStorage.removeItem(storageKey);
  notifySelfForStorage(storageKey);
}

function getTheme(key) {
  try {
    const value = JSON.parse(localStorage.getItem(themeStorageKey(key)));
    value.theme = normalizeTheme(value.theme);
    return value;
  } catch (e) {
    return null;
  }
}

function listThemes() {
  const themes = {};
  for (let idx = 0; idx < localStorage.length; idx++) {
    const storageKey = localStorage.key(idx);
    if (isThemeStorageKey(storageKey)) {
      const themeKey = themeKeyFromStorage(storageKey);
      const theme = getTheme(themeKey);
      if (theme !== null) {
        themes[themeKey] = theme;
      }
    }
  }
  return themes;
}

// HACK: Storage events are dispatched to all windows *except* the one that
// made the change. This utility sends a storage event to the current window.
function notifySelfForStorage(storageKey) {
  const event = document.createEvent("Event");
  event.initEvent("storage", true, true);
  event.key = storageKey;
  window.dispatchEvent(event);
}

function init(store) {
  const updateSavedThemesInStore = () => {
    const savedThemes = listThemes();
    log("updateSavedThemesInStore", savedThemes);
    store.dispatch(actions.ui.setSavedThemes({ savedThemes }));
  };

  updateSavedThemesInStore();

  window.addEventListener(
    "storage",
    e => {
      log("storage event", e);
      if (isThemeStorageKey(e.key)) {
        updateSavedThemesInStore();
      }
    }
  );
}

export default {
  init,
  generateThemeKey,
  putTheme,
  deleteTheme,
  getTheme,
  listThemes
};
