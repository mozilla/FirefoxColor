import tinycolor from "tinycolor2";
import { normalizeTheme } from "./themes";
import { presetThemesContext } from "./assets";
const defaultTheme = presetThemesContext("./default.json");

const WCAG_AA = 4.5;
const MAX_CONTRAST_RATIO = 21;

const cloneDefault = () => {
  return JSON.parse(JSON.stringify(defaultTheme));
};

export const generateRandomTheme = () => {
  const newTheme = cloneDefault();

  Object.keys(newTheme.colors).map(key => {
    newTheme.colors[key] = tinycolor.random().toRgb();
  });

  return normalizeTheme(newTheme);
};

export const distributePalette = (theme, name, color) => {
  const newTheme = JSON.parse(JSON.stringify(theme));
  const seed = tinycolor(color);
  const nextColors = {
    base: seed.toRgb(),
    lighter: seed.lighten(5).toRgb(),
    lightest: seed.lighten(10).toRgb(),
    darker: seed.darken(10).toRgb(),
    darkest: seed.darken(20).toRgb()
  };
  switch (name) {
    case "base":
      newTheme.colors.button_background_active = nextColors.lightest;
      newTheme.colors.button_background_hover = nextColors.lighter;
      newTheme.colors.tab_selected = nextColors.base;
      newTheme.colors.toolbar = nextColors.base;
      newTheme.colors.toolbar_bottom_separator = nextColors.darkest;
      newTheme.colors.toolbar_field = nextColors.lightest;
      newTheme.colors.toolbar_field_border = nextColors.darkest;
      newTheme.colors.toolbar_field_focus = nextColors.base;
      newTheme.colors.toolbar_field_separator = nextColors.base;
      newTheme.colors.toolbar_vertical_separator = nextColors.darker;
      break;
    case "accent":
      newTheme.colors.accentcolor = nextColors.base;
      newTheme.colors.ntp_background = nextColors.lighter;
      newTheme.colors.popup = nextColors.lighter;
      newTheme.colors.popup_border = nextColors.lightest;
      newTheme.colors.popup_highlight_text = nextColors.lightest;
      newTheme.colors.toolbar_field_text_focus = nextColors.base;
      newTheme.colors.toolbar_top_separator = nextColors.darkest;
      break;
    case "complement":
      newTheme.colors.icons = nextColors.base;
      newTheme.colors.icons_attention = nextColors.darker;
      newTheme.colors.ntp_text = nextColors.base;
      newTheme.colors.popup_highlight = nextColors.darker;
      newTheme.colors.popup_text = nextColors.darkest;
      newTheme.colors.tab_background_separator = nextColors.lightest;
      newTheme.colors.tab_line = nextColors.base;
      newTheme.colors.tab_loading = nextColors.base;
      newTheme.colors.tab_text = nextColors.base;
      newTheme.colors.textcolor = nextColors.darkest;
      newTheme.colors.toolbar_field_border_focus = nextColors.lightest;
      newTheme.colors.toolbar_field_text = nextColors.base;
      newTheme.colors.toolbar_text = nextColors.base;

      break;
    case "default":
      return null;
  }

  return normalizeTheme(newTheme);
};

export const generateComplementaryTheme = (color = null) => {
  const newTheme = cloneDefault();
  const seed = color === null ? tinycolor.random() : tinycolor(color);
  const baseColor = seed.toRgb();
  const lighterColor = seed.lighten(5).toRgb();
  const lightestColor = seed.lighten(10).toRgb();
  const darkColor = seed.darken(5).toRgb();
  const darkerColor = seed.darken(10).toRgb();
  const darkestColor = seed.darken(20).toRgb();
  const complementColor = createA11yColor(seed.complement().toRgb(), baseColor);

  newTheme.colors.accentcolor = lighterColor;
  newTheme.colors.button_background_active = darkestColor;
  newTheme.colors.button_background_hover = darkColor;
  newTheme.colors.icons = complementColor;
  newTheme.colors.icons_attention = complementColor;
  newTheme.colors.ntp_background = lightestColor;
  newTheme.colors.ntp_text = complementColor;
  newTheme.colors.popup = lightestColor;
  newTheme.colors.popup_border = darkerColor;
  newTheme.colors.popup_highlight = darkerColor;
  newTheme.colors.popup_highlight_text = complementColor;
  newTheme.colors.popup_text = complementColor;
  newTheme.colors.tab_background_separator = darkestColor;
  newTheme.colors.tab_line = complementColor;
  newTheme.colors.tab_loading = complementColor;
  newTheme.colors.tab_selected = baseColor;
  newTheme.colors.tab_text = complementColor;
  newTheme.colors.textcolor = complementColor;
  newTheme.colors.toolbar = baseColor;
  newTheme.colors.toolbar_bottom_separator = darkestColor;
  newTheme.colors.toolbar_field = lighterColor;
  newTheme.colors.toolbar_field_border = darkestColor;
  newTheme.colors.toolbar_field_border_focus = lightestColor;
  newTheme.colors.toolbar_field_focus = lighterColor;
  newTheme.colors.toolbar_field_separator = darkestColor;
  newTheme.colors.toolbar_field_text = complementColor;
  newTheme.colors.toolbar_field_text_focus = complementColor;
  newTheme.colors.toolbar_text = complementColor;
  newTheme.colors.toolbar_top_separator = darkestColor;
  newTheme.colors.toolbar_vertical_separator = darkestColor;

  return normalizeTheme(newTheme);
};

const createA11yColor = (testColor, comparisonColor) => {
  // Just return if A11y already
  if (tinycolor.isReadable(testColor, comparisonColor)) return testColor;

  let a11yColor = null;
  let minValidRatio = MAX_CONTRAST_RATIO;

  // Otherwise, create an array of colors with the same hue as the test color
  // and get the one closest to, but above the WCAG_AA Limit
  tinycolor(testColor)
    .monochromatic()
    .filter(function(color) {
      const ratio = tinycolor.readability(color, comparisonColor);
      if (ratio < minValidRatio && ratio >= WCAG_AA) {
        a11yColor = color;
        minValidRatio = ratio;
      }
    });

  // If all else fails, check for a dark color and make the a11y color white or black
  if (a11yColor === null) {
    a11yColor = tinycolor(comparisonColor).isDark()
      ? tinycolor("white")
      : tinycolor("black");
  }

  return a11yColor.toRgb();
};
