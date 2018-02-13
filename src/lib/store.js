import { createStore, combineReducers } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import undoable, { ActionCreators } from 'redux-undo';
import { defaultColors } from './constants';

// Actions that should trigger a theme update in URL history and the add-on
export const themeChangeActions = ['SET_THEME', 'SET_COLOR', 'SET_BACKGROUND'];

export const actions = {
  ui: createActions(
    {},
    'SET_SELECTED_COLOR',
    'SET_HAS_EXTENSION',
    'SET_PENDING_THEME',
    'CLEAR_PENDING_THEME'
  ),
  theme: {
    ...createActions({}, ...themeChangeActions),
    // HACK: Seems like redux-undo doesn't have sub-tree specific undo/redo
    // actions - but let's fake it for now.
    undo: ActionCreators.undo,
    redo: ActionCreators.redo
  }
};

const themesEqual = (themeA, themeB) =>
  // HACK: "deep equal" via stringify
  // http://www.mattzeunert.com/2016/01/28/javascript-deep-equal.html
  JSON.stringify(themeA) === JSON.stringify(themeB);

export const selectors = {
  hasExtension: state => state.ui.hasExtension,
  selectedColor: state => state.ui.selectedColor,
  shouldOfferPendingTheme: state =>
    !state.ui.userHasEdited &&
    state.ui.pendingTheme !== null &&
    !themesEqual(state.ui.pendingTheme, state.theme.present),
  pendingTheme: state => state.ui.pendingTheme,
  theme: state => state.theme.present,
  themeCanUndo: state => state.theme.past.length > 0,
  themeCanRedo: state => state.theme.future.length > 0
};

export const reducers = {
  ui: handleActions(
    {
      SET_PENDING_THEME: (state, { payload: { theme } }) => ({
        ...state,
        pendingTheme: theme
      }),
      CLEAR_PENDING_THEME: state => ({ ...state, pendingTheme: null }),
      SET_SELECTED_COLOR: (state, { payload: { name } }) => ({
        ...state,
        selectedColor: name
      }),
      SET_HAS_EXTENSION: (state, { payload: { hasExtension } }) => ({
        ...state,
        hasExtension
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
      selectedColor: 'toolbar',
      hasExtension: false
    }
  ),
  theme: undoable(
    handleActions(
      {
        SET_THEME: (state, { payload: { theme } }) => ({ ...theme }),
        SET_COLORS: (state, { payload: { colors } }) => ({ ...state, colors }),
        SET_COLOR: (state, { payload: { name, h, s, l, a } }) => ({
          ...state,
          colors: { ...state.colors, [name]: { h, s, l, a } }
        }),
        SET_BACKGROUND: (state, { payload: { url } }) => ({
          ...state,
          images: { ...state.images, headerURL: url }
        })
      },
      {
        images: { headerURL: '' },
        colors: defaultColors
      }
    )
  )
};

export const createAppStore = (initialState, enhancers) =>
  createStore(combineReducers({ ...reducers }), initialState, enhancers);
