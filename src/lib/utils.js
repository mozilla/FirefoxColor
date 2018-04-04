export const DEBUG = process.env.NODE_ENV === "development";

export const makeLog = context => (...args) =>
  // eslint-disable-next-line no-console
  DEBUG && console.log(`[FirefoxColor ${context}]`, ...args);
