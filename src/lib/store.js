import { createStore, combineReducers } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import undoable, { ActionCreators } from 'redux-undo';
import { defaultColors } from './constants';

export const actions = {
  ui: createActions({}, 'SET_SELECTED_COLOR', 'SET_HAS_EXTENSION'),
  theme: {
    ...createActions(
      {},
      'SET_THEME',
      'SET_COLORS',
      'SET_COLOR',
      'SET_BACKGROUND'
    ),
    // HACK: Seems like redux-undo doesn't have sub-tree specific undo/redo
    // actions - but let's fake it for now.
    undo: ActionCreators.undo,
    redo: ActionCreators.redo
  }
};

export const selectors = {
  hasExtension: state => state.ui.hasExtension,
  selectedColor: state => state.ui.selectedColor,
  theme: state => state.theme.present,
  themeCanUndo: state => state.theme.past.length > 0,
  themeCanRedo: state => state.theme.future.length > 0
};

export const reducers = {
  ui: handleActions(
    {
      SET_SELECTED_COLOR: (state, { payload: { name } }) => ({
        ...state,
        selectedColor: name
      }),
      SET_HAS_EXTENSION: (state, { payload: { hasExtension } }) => ({
        ...state,
        hasExtension
      })
    },
    {
      selectedColor: 'toolbar',
      hasExtension: false
    }
  ),
  theme: undoable(handleActions(
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
  ))
};

export const createAppStore = (initialState, enhancers) =>
  createStore(combineReducers({ ...reducers }), initialState, enhancers);
