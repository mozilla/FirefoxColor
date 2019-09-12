import React from "react";
import classnames from "classnames";
import {
  localStorageSpace,
  STORAGE_ERROR_MESSAGE,
  STORAGE_ERROR_MESSAGE_DURATION
} from "../StorageSpaceInformation";

export const ThemeSaveButton = ({
  children,
  name,
  theme,
  storage,
  userHasEdited,
  modifiedSinceSave,
  setThemeBuilderPanel,
  setUsedStorage,
  setStorageErrorMessage
}) => {
  const { themeStorage } = storage;
  const saveTheme = () => {
    if (!modifiedSinceSave) {
      return;
    }

    try {
      let space = localStorageSpace();
      themeStorage.put(themeStorage.generateKey(), theme);
      setThemeBuilderPanel(3);
      setUsedStorage({ space });
    } catch (err) {
      console.error(err);
      setStorageErrorMessage(STORAGE_ERROR_MESSAGE);
      setTimeout(
        () => setStorageErrorMessage(""),
        STORAGE_ERROR_MESSAGE_DURATION
      );
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