import { createStore, combineReducers } from "redux";
import { createActions, handleActions, combineActions } from "redux-actions";
import undoable, { ActionCreators, ActionTypes } from "redux-undo";
import {
  themesEqual,
  normalizeTheme,
  normalizeThemeColor,
  normalizeThemeColors
} from "./themes";

// Actions that should trigger a theme update in URL history and the add-on
export const themeChangeActions = [
  "SET_THEME",
  "SET_COLOR",
  "SET_BACKGROUND",
  "ADD_CUSTOM_BACKGROUND",
  "UPDATE_CUSTOM_BACKGROUND",
  "CLEAR_CUSTOM_BACKGROUND",
  "MOVE_CUSTOM_BACKGROUND",
  ActionTypes.UNDO,
  ActionTypes.REDO
];

export const actions = {
  ui: createActions(
    {},
    "SET_SELECTED_COLOR",
    "SET_HAS_EXTENSION",
    "SET_FIRST_RUN",
    "SET_PENDING_THEME",
    "CLEAR_PENDING_THEME",
    "SET_LOADER_DELAY_EXPIRED",
    "SET_SAVED_THEMES",
    "SET_SAVED_THEMES_PAGE",
    "SET_CURRENT_SAVED_THEME",
    "SET_PRESET_THEMES_PAGE",
    "SET_DISPLAY_LEGAL_MODAL",
    "SET_DISPLAY_SHARE_MODAL",
    "SET_DISPLAY_REMOVE_IMAGE_MODAL",
    "SET_THEME_BUILDER_PANEL",
    "SHOW_EXPORT_THEME_DIALOG",
    "EXPORT_THEME",
    "SET_EXPORT_THEME_PROGRESS",
    "CLEAR_EXPORTED_THEME",
    "SET_USED_STORAGE",
    "SET_STORAGE_ERROR_MESSAGE"
  ),
  theme: {
    ...createActions(
      {},
      "SET_THEME",
      "SET_COLOR",
      "SET_BACKGROUND",
      "ADD_CUSTOM_BACKGROUND",
      "UPDATE_CUSTOM_BACKGROUND",
      "CLEAR_CUSTOM_BACKGROUND",
      "MOVE_CUSTOM_BACKGROUND"
    ),
    // HACK: Seems like redux-undo doesn't have sub-tree specific undo/redo
    // actions - but let's fake it for now.
    undo: ActionCreators.undo,
    redo: ActionCreators.redo
  },
  images: {
    ...createActions(
      {},
      "LOAD_IMAGES",
      "LOAD_IMAGE",
      "ADD_IMAGE",
      "UPDATE_IMAGE",
      "DELETE_IMAGES"
    )
  }
};

export const selectors = {
  hasExtension: state => state.ui.hasExtension,
  themeBuilderPanel: state => state.ui.themeBuilderPanel,
  firstRun: state => state.ui.firstRun,
  loaderDelayExpired: state => state.ui.loaderDelayExpired,
  selectedColor: state => state.ui.selectedColor,
  displayLegalModal: state => state.ui.displayLegalModal,
  displayShareModal: state => state.ui.displayShareModal,
  displayRemoveImageModal: state => state.ui.displayRemoveImageModal,
  shouldOfferPendingTheme: state =>
    state.ui.hasExtension &&
    !state.ui.firstRun &&
    !state.ui.userHasEdited &&
    state.ui.pendingTheme !== null &&
    !themesEqual(state.ui.pendingTheme, state.theme.present),
  pendingTheme: state => state.ui.pendingTheme,
  savedThemes: state => state.ui.savedThemes,
  savedThemesPage: state => state.ui.savedThemesPage,
  hasSavedThemes: state => Object.keys(state.ui.savedThemes).length > 0,
  theme: state => state.theme.present,
  themePast: state => state.theme.past,
  themeFuture: state => state.theme.future,
  themeCanUndo: state => {
    const { theme } = state;
    const { present, past } = theme;
    const presentImagesLength = present && present.images && present.images.custom_backgrounds && present.images.custom_backgrounds.length;
    const pastImagesLength = past.length && past[past.length - 1] && past[past.length - 1].images && past[past.length - 1].images.custom_backgrounds && past[past.length - 1].images.custom_backgrounds.length;
    return past.length > 0 && presentImagesLength >= pastImagesLength;
  },
  themeCanRedo: state => state.theme.future.length > 0,
  themeCustomImages: state => state.images.images,
  themeCustomBackgrounds: state =>
    state.theme.present.images.custom_backgrounds || [],
  themeHasCustomBackgrounds: state => {
    const backgrounds = selectors.themeCustomBackgrounds(state);
    return !!backgrounds && backgrounds.length > 0;
  },
  userHasEdited: state => state.ui.userHasEdited,
  presetThemesPage: state => state.ui.presetThemesPage,
  modifiedSinceSave: state =>
    Object.values(state.ui.savedThemes).filter(({ theme }) =>
      themesEqual(theme, state.theme.present)
    ).length === 0,
  shouldShowExportThemeDialog: state => !!state.ui.shouldShowExportThemeDialog,
  exportedTheme: state => state.ui.exportedTheme,
  shouldOfferExportedTheme: state => !!state.ui.exportedTheme,
  isThemeExportInProgress: state => !!state.ui.exportedThemeProgress,
  storageErrorMessage: state => state.ui.storageErrorMessage,
  usedStorage: state => state.ui.usedStorage
};

export const reducers = {
  ui: handleActions(
    {
      SET_USED_STORAGE: (state, { payload: { space } }) => {
        return {
          ...state,
          usedStorage: space
        };
      },
      SET_STORAGE_ERROR_MESSAGE: (state, { payload }) => {
        return {
          ...state,
          storageErrorMessage: payload
        };
      },
      SET_DISPLAY_LEGAL_MODAL: (state, { payload: { display } }) => ({
        ...state,
        displayLegalModal: display
      }),
      SET_DISPLAY_SHARE_MODAL: (state, { payload: { display } }) => ({
        ...state,
        displayShareModal: display
      }),
      SET_DISPLAY_REMOVE_IMAGE_MODAL: (state, { payload: { display } }) => ({
        ...state,
        displayRemoveImageModal: display
      }),
      SET_PENDING_THEME: (state, { payload: { theme } }) => ({
        ...state,
        pendingTheme: normalizeTheme(theme)
      }),
      CLEAR_PENDING_THEME: state => ({ ...state, pendingTheme: null }),
      SET_SAVED_THEMES: (state, { payload: { savedThemes } }) => ({
        ...state,
        savedThemes: Object.entries(savedThemes).reduce(
          (acc, [key, savedTheme]) => ({
            ...acc,
            [key]: { ...savedTheme, theme: normalizeTheme(savedTheme.theme) }
          }),
          {}
        )
      }),
      SET_THEME_BUILDER_PANEL: (state, { payload }) => {
        return {
          ...state,
          themeBuilderPanel: payload
        };
      },
      SET_SAVED_THEMES_PAGE: (
        state,
        { payload: { page: savedThemesPage } }
      ) => ({
        ...state,
        savedThemesPage
      }),
      SET_PRESET_THEMES_PAGE: (
        state,
        { payload: { page: presetThemesPage } }
      ) => ({
        ...state,
        presetThemesPage
      }),
      SET_CURRENT_SAVED_THEME: (state, { payload: { currentSavedTheme } }) => ({
        ...state,
        currentSavedTheme
      }),
      SET_SELECTED_COLOR: (state, { payload: { name } }) => ({
        ...state,
        selectedColor: name
      }),
      SET_HAS_EXTENSION: (state, { payload: { hasExtension } }) => ({
        ...state,
        hasExtension
      }),
      SET_FIRST_RUN: (state, { payload: firstRun }) => ({
        ...state,
        firstRun
      }),
      SET_LOADER_DELAY_EXPIRED: (state, { payload: loaderDelayExpired }) => ({
        ...state,
        loaderDelayExpired
      }),
      SHOW_EXPORT_THEME_DIALOG: (
        state,
        { payload: shouldShowExportThemeDialog = true }
      ) => ({
        ...state,
        shouldShowExportThemeDialog
      }),
      EXPORT_THEME: (state, { payload: exportedTheme }) => ({
        ...state,
        exportedTheme,
        exportedThemeProgress: false
      }),
      SET_EXPORT_THEME_PROGRESS: (state, { payload }) => ({
        ...state,
        exportedTheme: null,
        exportedThemeProgress: payload
      }),
      CLEAR_EXPORTED_THEME: state => ({
        ...state,
        shouldShowExportThemeDialog: false,
        exportedTheme: null,
        exportedThemeProgress: false
      }),
      [combineActions(...themeChangeActions)]: (state, { meta = {} }) => ({
        ...state,
        userHasEdited: meta.userEdit ? true : state.userHasEdited
      })
    },
    {
      userHasEdited: false,
      pendingTheme: null,
      savedThemes: {},
      savedThemesPage: 0,
      presetThemesPage: 0,
      currentSavedTheme: null,
      selectedColor: null,
      hasExtension: false,
      loaderDelayExpired: false,
      displayLegalModal: false,
      displayShareModal: false,
      displayRemoveImageModal: false,
      themeBuilderPanel: 1,
      shouldShowExportThemeDialog: false,
      exportedTheme: null,
      exportedThemeProgress: false,
      storageErrorMessage: "",
      usedStorage: 0
    }
  ),
  images: handleActions(
    {
      ADD_IMAGE: (
        state,
        { payload: { name, importing = true, size, image, type } }
      ) => ({
        ...state,
        images: {
          ...state.images,
          [name]: { name, importing, size, image, type }
        }
      }),
      DELETE_IMAGES: (state, { payload: names = [] }) => {
        const images = { ...state.images };
        names.forEach(name => delete images[name]);
        return { ...state, images };
      },
      LOAD_IMAGES: (state, { payload: images = {} }) => ({ ...state, images }),
      // LOAD_IMAGE differs from UPDATE_IMAGE in that the middleware does not
      // trigger add-on updates - mostly used for local updates to the web app
      // due to localStorage events keeping multiple tabs in sync.
      [combineActions("LOAD_IMAGE", "UPDATE_IMAGE")]: (
        state,
        { payload: update = {} }
      ) => ({
        ...state,
        images: {
          ...state.images,
          [update.name]: { ...state.images[update.name], ...update }
        }
      })
    },
    {
      images: {}
    }
  ),
  theme: undoable(
    handleActions(
      {
        SET_THEME: (state, { payload: { theme } }) => normalizeTheme(theme),
        SET_COLORS: (state, { payload: { colors } }) => ({
          ...state,
          colors: normalizeThemeColors(colors)
        }),
        SET_COLOR: (state, { payload: { name, color } }) => ({
          ...state,
          colors: { ...state.colors, [name]: normalizeThemeColor(name, color) }
        }),
        SET_BACKGROUND: (state, { payload: { url } }) => ({
          ...state,
          images: { ...state.images, additional_backgrounds: [url] }
        }),
        ADD_CUSTOM_BACKGROUND: (
          state,
          { payload: { name, tiling, alignment } }
        ) => ({
          ...state,
          images: {
            ...state.images,
            custom_backgrounds: [
              { name, tiling, alignment },
              ...(state.images.custom_backgrounds || [])
            ]
          }
        }),
        UPDATE_CUSTOM_BACKGROUND: (
          state,
          { payload: { index, ...update } }
        ) => {
          const custom_backgrounds = [
            ...(state.images.custom_backgrounds || [])
          ];
          custom_backgrounds[index] = {
            ...custom_backgrounds[index],
            ...update
          };
          return {
            ...state,
            images: {
              ...state.images,
              custom_backgrounds
            }
          };
        },
        CLEAR_CUSTOM_BACKGROUND: (state, { payload: { index } }) => {
          const custom_backgrounds = [
            ...(state.images.custom_backgrounds || [])
          ];
          custom_backgrounds.splice(index, 1);
          return {
            ...state,
            images: { ...state.images, custom_backgrounds }
          };
        },
        MOVE_CUSTOM_BACKGROUND: (
          state,
          { payload: { newIndex, oldIndex } }
        ) => {
          // see: https://medium.com/kevin-salters-blog/reordering-a-javascript-array-based-on-a-drag-and-drop-interface-e3ca39ca25c
          const originalArray = state.images.custom_backgrounds;
          const movedItem = originalArray.find(
            (item, index) => index === oldIndex
          );
          const remainingItems = originalArray.filter(
            (item, index) => index !== oldIndex
          );
          const reorderedItems = [
            ...remainingItems.slice(0, newIndex),
            movedItem,
            ...remainingItems.slice(newIndex)
          ];
          const newState = {
            ...state,
            images: { ...state.images, custom_backgrounds: reorderedItems }
          };
          return newState;
        }
      },
      normalizeTheme()
    ),
    {
      // Only track explicit user edits in undo/redo history, theme changes
      // from add-on and ?theme are applied but skip the buffer
      syncFilter: true,
      filter: (action, currentState, previousHistory) => {
        // Issue #227: Skip history for identical themes
        if (themesEqual(previousHistory.present, currentState)) {
          return false;
        }
        return action.meta && action.meta.userEdit;
      }
    }
  )
};

export const createAppStore = (initialState, enhancers) =>
  createStore(combineReducers({ ...reducers }), initialState, enhancers);
