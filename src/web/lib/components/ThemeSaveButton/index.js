import React from "react";

import "./index.scss";

export const ThemeSaveButton = ({
  theme,
  generateThemeKey,
  putTheme,
  userHasEdited,
  modifiedSinceSave
}) => {
  const saveTheme = () => putTheme(generateThemeKey(), theme);

  return (
    <div className="theme-save-button">
      <h2>Save your theme</h2>
      <button onClick={saveTheme} title={!userHasEdited || modifiedSinceSave ? "Save" : "Saved!"} disabled={!modifiedSinceSave}>{!userHasEdited || modifiedSinceSave ? "Save" : "Saved!"}</button>
    </div>
  );
};

export default ThemeSaveButton;
