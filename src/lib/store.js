import { createStore, combineReducers } from "redux";
import { createActions, handleActions } from "redux-actions";
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
    "SET_DISPLAY_LEGAL_MODAL"
  ),
  theme: {
    ...createActions({}, "SET_THEME", "SET_COLOR", "SET_BACKGROUND"),
    // HACK: Seems like redux-undo doesn't have sub-tree specific undo/redo
    // actions - but let's fake it for now.
    undo: ActionCreators.undo,
    redo: ActionCreators.redo
  }
};

export const selectors = {
  hasExtension: state => state.ui.hasExtension,
  firstRun: state => state.ui.firstRun,
  loaderDelayExpired: state => state.ui.loaderDelayExpired,
  selectedColor: state => state.ui.selectedColor,
  displayLegalModal: state => state.ui.displayLegalModal,
  shouldOfferPendingTheme: state =>
    !state.ui.firstRun &&
    !state.ui.userHasEdited &&
    state.ui.pendingTheme !== null &&
    !themesEqual(state.ui.pendingTheme, state.theme.present),
  pendingTheme: state => state.ui.pendingTheme,
  savedThemes: state => state.ui.savedThemes,
  savedThemesPage: state => state.ui.savedThemesPage,
  hasSavedThemes: state => Object.keys(state.ui.savedThemes).length > 0,
  theme: state => state.theme.present,
  themeCanUndo: state => state.theme.past.length > 0,
  themeCanRedo: state => state.theme.future.length > 0,
  userHasEdited: state => state.ui.userHasEdited,
  modifiedSinceSave: state =>
    state.ui.userHasEdited &&
    !themesEqual(state.ui.currentSavedTheme, state.theme.present)
};

export const reducers = {
  ui: handleActions(
    {
      SET_DISPLAY_LEGAL_MODAL: (state, { payload: { display } }) => ({
        ...state,
        displayLegalModal: display
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
      SET_SAVED_THEMES_PAGE: (
        state,
        { payload: { page: savedThemesPage } }
      ) => ({
        ...state,
        savedThemesPage
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
      SET_THEME: (state, { meta }) => ({
        ...state,
        userHasEdited: meta && meta.userEdit ? true : state.userHasEdited
      }),
      SET_COLOR: state => ({ ...state, userHasEdited: true }),
      SET_BACKGROUND: state => ({ ...state, userHasEdited: true })
    },
    {
      userHasEdited: false,
      pendingTheme: null,
      savedThemes: {},
      savedThemesPage: 0,
      currentSavedTheme: null,
      selectedColor: null,
      hasExtension: false,
      loaderDelayExpired: false,
      displayLegalModal: false
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
          colors: { ...state.colors, [name]: normalizeThemeColor(color) }
        }),
        SET_BACKGROUND: (state, { payload: { url } }) => ({
          ...state,
          images: { ...state.images, additional_backgrounds: [url] }
        })
      },
      normalizeTheme()
    ), {
      // Only track explicit user edits in undo/redo history, theme changes
      // from add-on and ?theme are applied but skip the buffer
      syncFilter: true,
      filter: (action, currentState, previousHistory) =>
        action.meta && action.meta.userEdit
    }
  )
};

export const createAppStore = (initialState, enhancers) =>
  createStore(combineReducers({ ...reducers }), initialState, enhancers);
