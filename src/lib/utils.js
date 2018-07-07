export const DEBUG = process.env.NODE_ENV === "development";

export const makeLog = context => (...args) =>
  // eslint-disable-next-line no-console
  DEBUG && console.log(`[FirefoxColor ${context}]`, ...args);

export const shuffle = array => {
  const arrayCopy = array.slice();
  for (let i = arrayCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
  }
  return arrayCopy;
};
