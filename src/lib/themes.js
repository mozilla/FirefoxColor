import tinycolor from "tinycolor2";
import {
  colorsWithAlpha,
  alphaEqualityTolerance,
  fallbackColors,
  CUSTOM_BACKGROUND_DEFAULT_ALIGNMENT,
  colorLabels,
  advancedColorLabels
} from "./constants";
import { presetThemesContext, bgImages } from "./assets";

const defaultTheme = presetThemesContext("./default.json");

const IMAGE_PROPS = ["name", "tiling", "alignment"];

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

  const imagesA = themeA.images && themeA.images.custom_backgrounds || [];
  const imagesB = themeB.images && themeB.images.custom_backgrounds || [] ;
  if (imagesA.length !== imagesB.length) {
    return false;
  }
  for (let idx = 0; idx < imagesA.length; idx++) {
    for (let propIdx = 0; propIdx < IMAGE_PROPS.length; propIdx++) {
      if (
        imagesA[idx][IMAGE_PROPS[propIdx]] !==
        imagesB[idx][IMAGE_PROPS[propIdx]]
      ) {
        return false;
      }
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

  const colorNames = [
    ...Object.keys(colorLabels),
    ...Object.keys(advancedColorLabels)
  ];

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
export const normalizeThemeColor = (name, data, defaultColor) => {
  const color = makeTinycolor(data || defaultColor).toRgb();
  if (!colorsWithAlpha.includes(name)) {
    delete color.a;
  }
  return color;
};

export const normalizeThemeColors = (colors = {}) => {
  const out = {};
  const { colors: defaultColors } = defaultTheme;
  const resolveColor = (name) => {
    let color = colors[name];
    if (color) {
      return color;
    }
    name = fallbackColors[name];
    if (Array.isArray(name)) {
      name = name.find(n => colors[n]);
    }
    return colors[name];
  };
  Object.keys(defaultColors).forEach(name => {
    const matchedColor = resolveColor(name);
    const color = normalizeThemeColor(name, matchedColor, defaultColors[name]);
    out[name] = color;
  });
  Object.keys(advancedColorLabels).forEach(name => {
    const matchedColor = resolveColor(name);
    if (matchedColor) {
      out[name] = normalizeThemeColor(name, matchedColor);
    }
  });

  return out;
};

// Utility to ensure normal properties and values in app theme state
export const normalizeTheme = (data = {}) => {
  const images = data.images ? data.images : {};
  const colors = data.colors ? data.colors : {};

  const theme = {
    colors: normalizeThemeColors(colors),
    images: {
      additional_backgrounds: []
    },
    title: data.title
  };

  let theme_frame = images.theme_frame || images.headerURL;
  if (theme_frame) {
    const background = normalizeThemeBackground(theme_frame);
    if (background) {
      theme.images.additional_backgrounds = [background];
    }
  }

  if (images.custom_backgrounds) {
    if (!Array.isArray(theme.images.custom_backgrounds)) {
      theme.images.custom_backgrounds = [];
    }
    theme.images.custom_backgrounds = images.custom_backgrounds || [];
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

export const convertToBrowserTheme = (themeData, bgImages, customBackgrounds) => {
  const newTheme = {
    images: {},
    properties: {},
    colors: {}
  };

  // Ensure that the theme data is normalized and any deprecated theme
  // property has been replaced with a supported one (and/or removed from
  // the theme object).
  const theme = normalizeTheme(themeData);

  const custom_backgrounds = theme.images.custom_backgrounds || [];
  if (custom_backgrounds.length > 0) {
    const additional_backgrounds = [];
    const additional_backgrounds_alignment = [];
    const additional_backgrounds_tiling = [];

    custom_backgrounds.forEach(({ name, alignment, tiling }) => {
      const background = customBackgrounds[name];
      if (!background || !background.image) {
        return;
      }
      additional_backgrounds.push(background.image);
      additional_backgrounds_alignment.push(
        alignment || CUSTOM_BACKGROUND_DEFAULT_ALIGNMENT
      );
      additional_backgrounds_tiling.push(tiling || "no-repeat");
    });

    newTheme.images.additional_backgrounds = additional_backgrounds;
    Object.assign(newTheme.properties, {
      additional_backgrounds_alignment,
      additional_backgrounds_tiling
    });
  } else {
    const background = normalizeThemeBackground(
      theme.images.additional_backgrounds[0]
    );
    if (background) {
      newTheme.images.additional_backgrounds = [bgImages(background)];
      Object.assign(newTheme.properties, {
        additional_backgrounds_alignment: ["top"],
        additional_backgrounds_tiling: ["repeat"]
      });
    }
  }

  Object.keys(theme.colors).forEach(key => {
    newTheme.colors[key] = colorToCSS(theme.colors[key]);
  });

  // TODO: we will need to actually create this field in
  // theme manifests as part of #93.
  newTheme.colors.tab_loading = colorToCSS(theme.colors.tab_line);

  return newTheme;
};
