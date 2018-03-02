const presetThemesContext = require.context(
  "../preset-themes/",
  false,
  /.*\.json/
);

export const defaultTheme = presetThemesContext("./default.json");

export const presetThemes = presetThemesContext
  .keys()
  .map((filename, idx) => ({ idx, filename, ...presetThemesContext(filename) }))
  .sort(({ filename: a }, { filename: b }) => a.localeCompare(b));
