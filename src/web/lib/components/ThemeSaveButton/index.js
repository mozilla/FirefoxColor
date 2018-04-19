import React from "react";

import "./index.scss";

export const ThemeSaveButton = ({
  theme,
  generateThemeKey,
  putTheme,
  modifiedSinceSave
}) => {
  const saveTheme = () => putTheme(generateThemeKey(), theme);

  return (
    <div className="theme-save-button">
      <h2>Save your theme</h2>
      <button onClick={saveTheme} title="Save" disabled={!modifiedSinceSave}>Save</button>
    </div>
  );
};

export default ThemeSaveButton;
