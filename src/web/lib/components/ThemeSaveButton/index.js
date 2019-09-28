import React from "react";
import classnames from "classnames";
import {
  STORAGE_ERROR_MESSAGE
} from "../StorageSpaceInformation";

export const ThemeSaveButton = ({
  children,
  name,
  theme,
  storage,
  userHasEdited,
  modifiedSinceSave,
  setThemeBuilderPanel,
  setStorageErrorMessage
}) => {
  const { themeStorage } = storage;
  const saveTheme = () => {
    if (!modifiedSinceSave) {
      return;
    }

    try {
      themeStorage.put(themeStorage.generateKey(), theme);
      setThemeBuilderPanel(3);
    } catch (err) {
      console.error(err);
      setStorageErrorMessage(STORAGE_ERROR_MESSAGE);
    }
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
