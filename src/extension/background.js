import { defaultColors } from '../lib/constants';

const colors = [];
let background = 0;

const theme = {
  images: {
    headerURL: 'images/bg-0.png',
    additional_backgrounds: ['bg-0.png']
  },
  properties: {
    additional_backgrounds_alignment: ['top'],
    additional_backgrounds_tiling: ['repeat']
  },
  colors: {}
};

const updateTheme = () => {
  for (const color of colors) {
    if (typeof color.a === 'undefined') {
      theme.colors[color.slug] = `hsla(${color.h},${color.s}%,${color.l}% )`;
    } else {
      theme.colors[color.slug] = `hsla(${color.h},${color.s}%,${color.l}%, ${color.a * 0.01})`;
    }
  }
  theme.images.additional_backgrounds[0] = `images/bg-${background}.png`;
};

const setTheme = () => {
  browser.theme.update(theme);
};

const connected = (port) => {
  port.postMessage({ type: 'init', colors, background });
  port.onMessage.addListener((message) => {
    if (message.type === 'update-color') {
      const { index, target, value } = message;
      colors[index][target] = value;
      browser.storage.local.set({ colors });
    } else if (message.type === 'update-background') {
      const { index } = message;
      background = index;
      browser.storage.local.set({ background });
    }
    updateTheme();
    setTheme();
  });
};

const getThemeFromStorage = browser.storage.local.get();

getThemeFromStorage.then((store) => {
  if (typeof store.colors === 'undefined') {
    for (const color of defaultColors) {
      colors.push(color);
    }
  } else {
    for (const color of store.colors) {
      colors.push(color);
      background = store.background; // eslint-disable-line prefer-destructuring
    }
  }
  updateTheme();
  setTheme();
});

browser.runtime.onConnect.addListener(connected);
