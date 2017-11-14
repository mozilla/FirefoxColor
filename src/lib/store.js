import { createStore, combineReducers } from 'redux';
import { createActions, handleActions } from 'redux-actions';
import { composeWithDevTools } from 'redux-devtools-extension';
import { defaultColors } from './constants';

const createActionsWithContext = (context, actionMap, ...identityActions) => {
  const result = createActions(actionMap, ...identityActions);
  Object.keys(result).forEach(key => {
    const fn = result[key];
    result[key] = args => ({ ...fn(args), meta: { context } });
  });
  return result;
};

export const makeActions = ({ context }) => {
  return {
    ui: createActionsWithContext(context, {}, 'SET_SELECTED_COLOR'),
    theme: createActionsWithContext(
      context,
      {},
      'SET_THEME',
      'SET_COLORS',
      'SET_COLOR',
      'SET_BACKGROUND'
    )
  };
};

export const selectors = {
  selectedColor: state => state.ui.selectedColor,
  theme: state => state.theme
};

export const reducers = {
  ui: handleActions(
    {
      SET_SELECTED_COLOR: (state, { payload: { name } }) => ({
        ...state,
        selectedColor: name
      })
    },
    {
      selectedColor: 'toolbar'
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
        newImage.headerURL = url;
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
  return createStore(
    combineReducers({ ...reducers }),
    initialState,
    enhancers
  );
};
