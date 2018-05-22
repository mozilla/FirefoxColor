export const presetThemesContext = require.context(
  "../preset-themes/",
  false,
  /.*\.json/
);

export const bgImages = require.context(
  "../images/patterns/",
  false,
  /bg-.*\.svg/
);

export const buttonImages = require.context(
  "../images/",
  false,
  /.*-16\.svg/
);
