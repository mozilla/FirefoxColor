import React from "react";
import classnames from "classnames";
import { connect } from "react-redux";

export const ThemeSaveButtonComponent = ({
  children,
  name,
  theme,
  storage,
  userHasEdited,
  modifiedSinceSave,
  setThemeBuilderPanel,
  dispatch
}) => {
  const { themeStorage } = storage;
  const saveTheme = () => {
    if (!modifiedSinceSave) {
      return;
    }
    themeStorage.put(themeStorage.generateKey(), theme, dispatch);
    setThemeBuilderPanel(4);
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

const ThemeSaveButton = connect(
  null,
  dispatch => ({ dispatch })
)(ThemeSaveButtonComponent);

export default ThemeSaveButton;
