import { defaultColors } from './constants';

export const DEBUG = process.env.NODE_ENV === 'development';

export const makeLog = context => (...args) =>
  // eslint-disable-next-line no-console
  DEBUG && console.log(`[ThemesRFun ${context}]`, ...args);

export const colorToCSS = color => {
  const { h, s, l, a } = color;
  return typeof a === 'undefined'
    ? `hsl(${h}, ${s}%, ${l}%)`
    : `hsla(${h}, ${s}%, ${l}%, ${a * 0.01})`;
};

// Utility to ensure normal & consistent colors
export const normalizeThemeColor = (data, defaultColor) => {
  const { h, s, l, a } = data || defaultColor;
  return {
    h: Math.floor(h),
    s: Math.floor(s),
    l: Math.floor(l),
    a
  };
};

export const normalizeThemeColors = (colors = {}) => {
  const out = {};
  Object.keys(defaultColors).forEach(name => {
    out[name] = normalizeThemeColor(colors[name], defaultColors[name]);
  });
  return out;
};

// Utility to ensure normal properties and values in app theme state
export const normalizeTheme = (data = {}) => {
  const theme = {
    colors: normalizeThemeColors(data.colors, defaultColors),
    images: { headerURL: '' }
  };
  const images = data.images ? data.images : {};
  if (images.headerURL) {
    theme.images.headerURL = images.headerURL;
  }
  return theme;
};
