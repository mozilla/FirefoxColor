import React from 'react';

import './index.scss';

export const ThemeSaveButton = ({
  theme,
  savedThemes,
  generateThemeKey,
  putTheme
}) => {
  const saveTheme = () => putTheme(generateThemeKey(), theme);

  return (
    <div className="themeSaveButton">
      <p>Save your theme ({Object.keys(savedThemes).length} saved):</p>
      <button onClick={saveTheme}>Save</button>
    </div>
  );
};

export default ThemeSaveButton;
