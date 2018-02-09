export const DEBUG = process.env.NODE_ENV === 'development';

export const makeLog = context => (...args) =>
  // eslint-disable-next-line no-console
  DEBUG && console.log(`[ThemesRFun ${context}]`, ...args);

export const floorHSLA = color => ({
  h: Math.floor(color.h),
  s: Math.floor(color.s),
  l: Math.floor(color.l),
  a: color.a
});

export const colorToCSS = color => {
  const { h, s, l, a } = floorHSLA(color);
  return typeof a === 'undefined'
    ? `hsl(${h}, ${s}%, ${l}%)`
    : `hsla(${h}, ${s}%, ${l}%, ${a * 0.01})`;
};
