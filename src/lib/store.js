import { createStore, combineReducers } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { composeWithDevTools } from 'redux-devtools-extension';
import { defaultColors } from './constants';

export const makeActions = ({ context }) => {
  const actions = {
    ui: createActions({}, 'SET_SELECTED_COLOR', 'SET_HAS_EXTENSION'),
    theme: createActions(
      {},
      'SET_THEME',
      'SET_COLORS',
      'SET_COLOR',
      'SET_BACKGROUND'
    )
  };

  // Wrap every action creator to add context for filtering in relays
  Object.entries(actions).forEach(([substore, creators]) =>
    Object.entries(creators).forEach(
      ([name, creator]) =>
        (creators[name] = args => ({
          ...creator(args),
          meta: { context }
        }))
    )
  );

  return actions;
};

export const selectors = {
  hasExtension: state => state.ui.hasExtension,
  selectedColor: state => state.ui.selectedColor,
  theme: state => state.theme
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
  theme: handleActions(
    {
      SET_THEME: (state, { payload: { theme } }) => ({ ...theme }),

      SET_COLORS: (state, { payload: { colors } }) => ({ ...state, colors }),

      SET_COLOR: (state, { payload: { name, h, s, l, a } }) => {
        const newColors = { ...state.colors };
        newColors[name] = { ...state.colors[name], h, s, l, a };
        return { ...state, colors: newColors };
      },

      SET_BACKGROUND: (state, { payload: { url } }) => {
        const newImages = { ...state.images };
        newImages.headerURL = url;
        return { ...state, images: newImages };
      }
    },
    {
      images: { headerURL: '' },
      colors: defaultColors
    }
  )
};

export const createAppStore = (initialState, enhancers) => {
  return createStore(combineReducers({ ...reducers }), initialState, enhancers);
};
