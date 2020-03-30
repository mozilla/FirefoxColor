export const DEBUG = process.env.NODE_ENV === "development";

export const makeLog = context => (...args) =>
  // eslint-disable-next-line no-console
  DEBUG && console.log(`[FirefoxColor ${context}]`, ...args);

export const getCustomImages = (backgroundImages = [], images = []) => {
  return backgroundImages.map(
    item => {
      let customImage = { ...item };
      let image = JSON.parse(localStorage.getItem(`IMAGE-${item.name}`));
      if (image) {
        customImage.image = images[item.name] && images[item.name].image;
        return customImage;
      }
      return null;
    }
  ).filter(Boolean);
};
