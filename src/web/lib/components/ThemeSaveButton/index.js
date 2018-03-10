import React from "react";

import "./index.scss";

export const ThemeSaveButton = ({
  theme,
  generateThemeKey,
  putTheme
}) => {
  const saveTheme = () => putTheme(generateThemeKey(), theme);

  return (
    <div className="theme-save-button">
      <h2>Save your theme</h2>
      <button onClick={saveTheme} title="Save">Save</button>
    </div>
  );
};

export default ThemeSaveButton;
