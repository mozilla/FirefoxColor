import tinycolor from "tinycolor2";
import { colorsWithAlpha, alphaEqualityTolerance } from "./constants";
import { presetThemesContext, bgImages } from "./assets";

const defaultTheme = presetThemesContext("./default.json");

export const themesEqual = (themeA, themeB) => {
  if (!!themeA !== !!themeB) {
    return false;
  }

  const hasImagesA =
    "images" in themeA && "additional_backgrounds" in themeA.images;
  const hasImagesB =
    "images" in themeB && "additional_backgrounds" in themeB.images;
  if (hasImagesA !== hasImagesB) {
    return false;
  }
  if (hasImagesA && hasImagesB) {
    // HACK: We only allow one image at this point, so be lazy:
    if (
      themeA.images.additional_backgrounds[0] !==
      themeB.images.additional_backgrounds[0]
    ) {
      return false;
    }
  }

  // TODO: Skipping title equality, because user themes don't have titles yet.

  const hasColorsA = "colors" in themeA;
  const hasColorsB = "colors" in themeB;
  if (hasColorsA !== hasColorsB) {
    return false;
  }
  if (!hasColorsA && !hasColorsB) {
    // HACK: Not having colors is invalid, but let's call them equal anyway.
    return true;
  }

  const colorNames = Object.keys(defaultTheme.colors);

  for (let name of colorNames) {
    const inA = name in themeA.colors;
    const inB = name in themeB.colors;
    if (inA !== inB) {
      return false;
    }
    if (!inA && !inB) {
      continue;
    }

    const colorA = themeA.colors[name];
    const colorB = themeB.colors[name];
    for (let channel of ["r", "g", "b"]) {
      if (colorA[channel] !== colorB[channel]) {
        return false;
      }
    }

    const alphaInA = "a" in colorA;
    const alphaInB = "a" in colorB;
    if (alphaInA !== alphaInB) {
      return false;
    }
    if (
      alphaInA &&
      alphaInB &&
      Math.abs(colorA.a - colorB.a) > alphaEqualityTolerance
    ) {
      return false;
    }
  }

  return true;
};

export const makeTinycolor = colorIn => {
  const color = { ...colorIn };
  if ("s" in color) {
    color.s = Math.floor(color.s) / 100.0;
  }
  if ("a" in color) {
    // HACK: normalize alpha value to two decimal places - LOL JS FP WTF
    if (color.a > 1.0) {
      color.a = Math.floor(color.a) / 100.0;
    }
    color.a = Math.ceil(color.a * 100) / 100.0;
  }
  return tinycolor(color);
};

export const colorToCSS = colorIn => makeTinycolor(colorIn).toRgbString();

export const normalizeThemeBackground = background =>
  bgImages.keys().includes(background) ? background : null;

// Utility to ensure normal & consistent colors
export const normalizeThemeColor = (data, defaultColor) =>
  makeTinycolor(data || defaultColor).toRgb();

export const normalizeThemeColors = (colors = {}) => {
  const out = {};
  const { colors: defaultColors } = defaultTheme;
  Object.keys(defaultColors).forEach(name => {
    const color = normalizeThemeColor(colors[name], defaultColors[name]);
    if (!colorsWithAlpha.includes(name)) {
      delete color.a;
    }
    out[name] = color;
  });
  return out;
};

// Utility to ensure normal properties and values in app theme state
export const normalizeTheme = (data = {}) => {
  const theme = {
    colors: normalizeThemeColors(data.colors, defaultTheme.colors),
    images: {
      additional_backgrounds: []
    },
    title: data.title
  };
  const images = data.images ? data.images : {};
  if (images.headerURL) {
    const background = normalizeThemeBackground(images.headerURL);
    if (background) {
      theme.images.additional_backgrounds = [background];
    }
  }
  if (images.additional_backgrounds) {
    const background = normalizeThemeBackground(
      images.additional_backgrounds[0]
    );
    if (background) {
      theme.images.additional_backgrounds = [background];
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
