import React from "react";
import classnames from "classnames";

export const ThemeSaveButton = ({
  children,
  name,
  theme,
  storage,
  userHasEdited,
  modifiedSinceSave,
  setThemeBuilderPanel
}) => {
  const { themeStorage } = storage;
  const saveTheme = () => {
    if (!modifiedSinceSave) {
      return;
    }
    themeStorage.put(themeStorage.generateKey(), theme);
    setThemeBuilderPanel(3);
  };
  return (
    <button
      className={classnames(name, {
        disabled: !modifiedSinceSave
      })}
      onClick={saveTheme}
      title={!userHasEdited || modifiedSinceSave ? "Save" : "Saved!"}
    >
      {children}
      <span>{!userHasEdited || modifiedSinceSave ? "Save" : "Saved!"}</span>
    </button>
  );
};

export default ThemeSaveButton;
