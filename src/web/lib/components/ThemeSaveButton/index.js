import React from "react";

import "./index.scss";

export const ThemeSaveButton = ({
  theme,
  storage,
  userHasEdited,
  modifiedSinceSave
}) => {
  const { themeStorage } = storage;
  const saveTheme = () => themeStorage.put(themeStorage.generateKey(), theme);
  return (
    <div className="theme-save-button">
      <h2>Save your theme</h2>
      <p>Copy your theme to get back to it later.</p>
      <button
        onClick={saveTheme}
        title={!userHasEdited || modifiedSinceSave ? "Save" : "Saved!"}
        disabled={!modifiedSinceSave}
      >
        {!userHasEdited || modifiedSinceSave ? "Save" : "Saved!"}
      </button>
    </div>
  );
};

export default ThemeSaveButton;
