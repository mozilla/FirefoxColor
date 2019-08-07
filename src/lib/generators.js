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

export const generateComplementaryTheme = (color = null) => {
  const newTheme = cloneDefault();
  const seed = color === null ? tinycolor.random() : tinycolor(color);
  const baseColor = seed.toRgb();
  const lightColor = seed.lighten(5).toRgb();
  const complementColor = createA11yColor(seed.complement().toRgb(), baseColor);

  newTheme.colors.toolbar = baseColor;
  newTheme.colors.toolbar_text = complementColor;
  newTheme.colors.frame = lightColor;
  newTheme.colors.tab_background_text = complementColor;
  newTheme.colors.toolbar_field = lightColor;
  newTheme.colors.toolbar_field_text = complementColor;
  newTheme.colors.tab_line = complementColor;
  newTheme.colors.popup = lightColor;
  newTheme.colors.popup_text = complementColor;

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
