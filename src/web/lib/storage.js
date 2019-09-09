import { actions } from "../../lib/store";
import { makeLog } from "../../lib/utils";
import { normalizeTheme, themesEqual } from "../../lib/themes";
import { localStorageSpace } from "./components/StorageSpaceInformation";

const log = makeLog("web.storage");

let currentSavedTheme;

class Storage {
  constructor({
    prefix,
    contentName = "data",
    normalize,
    afterPut,
    checkDuplicate
  }) {
    this.prefix = prefix;
    this.contentName = contentName;
    this.normalize = normalize || (data => data);
    this.checkDuplicate = checkDuplicate || (() => false);
    this.afterPut = afterPut || (() => {});
  }

  storageKey = str => `${this.prefix}${str}`;
  isKey = str => str.indexOf(this.prefix) === 0;
  keyFromStorage = str => str.substr(this.prefix.length);
  generateKey = () => `${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  put(key, data) {
    let isDuplicate = this.checkDuplicate(data);
    if (!isDuplicate) {
      const storageKey = this.storageKey(key);
      log("put", storageKey, data);
      localStorage.setItem(
        storageKey,
        JSON.stringify({ [this.contentName]: data, modified: Date.now() })
      );
      this.afterPut(data);
      notifySelfForStorage(storageKey);
    }
  }

  delete(key) {
    const storageKey = this.storageKey(key);
    log("delete", storageKey);
    localStorage.removeItem(storageKey);
    notifySelfForStorage(storageKey);
  }

  get(key) {
    try {
      const value = JSON.parse(localStorage.getItem(this.storageKey(key)));
      value[this.contentName] = this.normalize(value[this.contentName]);
      return value;
    } catch (e) {
      return null;
    }
  }

  list() {
    const items = {};
    for (let idx = 0; idx < localStorage.length; idx++) {
      const storageKey = localStorage.key(idx);
      if (this.isKey(storageKey)) {
        const itemKey = this.keyFromStorage(storageKey);
        const item = this.get(itemKey);
        if (item !== null) {
          items[itemKey] = item;
        }
      }
    }
    return items;
  }
}

const themeStorage = new Storage({
  prefix: "THEME-",
  contentName: "theme",
  normalize: normalizeTheme,
  checkDuplicate: theme => {
    const items = themeStorage.list();
    return Object.keys(items).some(key => {
      return themesEqual(theme, items[key].theme);
    });
  },
  afterPut: data => (currentSavedTheme = data)
});

const imageStorage = new Storage({
  prefix: "IMAGE-"
});

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
    const savedThemes = themeStorage.list();
    log("updateSavedThemesInStore", savedThemes);
    store.dispatch(actions.ui.setSavedThemes({ savedThemes }));
  };

  const getUsedStorage = () => {
    const space = localStorageSpace();
    log("getUsedStorage", space);
    store.dispatch(actions.ui.setUsedStorage({ space }));
  };

  const loadAllImagesIntoStore = () => {
    const items = Object.values(imageStorage.list()).reduce(
      (acc, { data: item }) => ({ ...acc, [item.name]: item }),
      {}
    );
    log("loadAllImagesIntoStore", items);
    store.dispatch(actions.images.loadImages(items));
  };

  const loadOneImageIntoStore = (key, newValue) => {
    const image = JSON.parse(newValue).data;
    log("loadOneImageIntoStore", key, image, newValue);
    store.dispatch(actions.images.loadImage(image));
  };

  loadAllImagesIntoStore();
  updateSavedThemesInStore();
  getUsedStorage();

  window.addEventListener("storage", e => {
    log("storage event", e);
    if (imageStorage.isKey(e.key) && e.newValue) {
      loadOneImageIntoStore(e.key, e.newValue);
    }
    if (themeStorage.isKey(e.key)) {
      updateSavedThemesInStore();
      store.dispatch(actions.ui.setCurrentSavedTheme({ currentSavedTheme }));
    }
  });
}

export default {
  init,
  themeStorage,
  imageStorage
};
