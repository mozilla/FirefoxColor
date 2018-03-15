const presetThemesContext = require.context(
  "../preset-themes/",
  false,
  /.*\.json/
);

export const bgImages = require.context(
  "../images/patterns/",
  false,
  /bg-.*\.svg/
);

const defaultTheme = presetThemesContext("./default.json");

export const colorToCSS = color => {
  const { h, s, l, a } = color;
  return typeof a === "undefined"
    ? `hsl(${h}, ${s}%, ${l}%)`
    : `hsla(${h}, ${s}%, ${l}%, ${a * 0.01})`;
};

export const normalizeThemeBackground = background =>
  bgImages.keys().includes(background) ? background : null;

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
  const { colors: defaultColors } = defaultTheme;
  Object.keys(defaultColors).forEach(name => {
    out[name] = normalizeThemeColor(colors[name], defaultColors[name]);
  });
  return out;
};

// Utility to ensure normal properties and values in app theme state
export const normalizeTheme = (data = {}) => {
  const theme = {
    colors: normalizeThemeColors(data.colors, defaultTheme.colors),
    images: {
      additional_backgrounds: [ ]
    }
  };
  const images = data.images ? data.images : {};
  if (images.headerURL) {
    const background = normalizeThemeBackground(images.headerURL);
    if (background) {
      theme.images.additional_backgrounds = [ background ];
    }
  }
  if (images.additional_backgrounds) {
    const background = normalizeThemeBackground(images.additional_backgrounds[0]);
    if (background) {
      theme.images.additional_backgrounds = [ background ];
    }
  }
  return theme;
};

export const presetThemes = presetThemesContext
  .keys()
  .map((filename, idx) => ({
    idx,
    filename,
    ...normalizeTheme(presetThemesContext(filename))
  }))
  .sort(({ filename: a }, { filename: b }) => a.localeCompare(b));
