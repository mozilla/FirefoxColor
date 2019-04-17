import React from "react";
import classnames from "classnames";

import {
  generateComplementaryTheme,
  generateRandomTheme
} from "../../../../lib/generators";

import ThemeSaveButton from "../ThemeSaveButton";
import ThemeUrl from "../ThemeUrl";

import iconUndo from "./icon_undo.svg";
import iconRedo from "./icon_redo.svg";
import iconHeart from "./icon_heart.svg";
import iconRandomize from "./icon_randomize.svg";
import iconShare from "./icon_share.svg";
import iconExport from "./icon_export.svg";

import "./index.scss";

export const AppHeader = props => {
  const {
    hasExtension,
    undo,
    redo,
    themeCanUndo,
    themeCanRedo,
    setTheme,
    isThemeExportInProgress,
    showExportThemeDialog,
    displayShareModal,
    setDisplayShareModal
  } = props;
  const handleRandomClick = () => {
    Math.random() >= 0.5
      ? setTheme({ theme: generateComplementaryTheme() })
      : setTheme({ theme: generateRandomTheme() });
  };

  const handleExportClick = () => {
    showExportThemeDialog(true);
  };

  const onShareClick = () => {
    setDisplayShareModal({ display: !displayShareModal });
  };

  const headerButton = (
    onClickButton,
    icon,
    text,
    disabledCheck = true,
    children = null
  ) => (
    <React.Fragment>
      <button
        title={text}
        className={classnames("app-header__button", `${text}`, {
          disabled: !disabledCheck
        })}
        onClick={onClickButton}
      >
        <div className="app-header__button-icon">
          <img src={icon} width="20" height="auto" aria-hidden="true" />
        </div>
        <span>{text}</span>
      </button>
      {children}
    </React.Fragment>
  );

  return (
    <header className="app-header">
      <div className="app-header__content">
        <div className="app-header__icon" />
        <div>
          <h1>Firefox Color</h1>
        </div>
      </div>
      <div className="app-header__controls">
        {headerButton(undo, iconUndo, "Undo", themeCanUndo)}
        {headerButton(redo, iconRedo, "Redo", themeCanRedo)}
        {headerButton(handleRandomClick, iconRandomize, "Random")}

        <div className="app-header__spacer" />

        <ThemeSaveButton name="app-header__button" {...props}>
          <div className="app-header__button-icon">
            <img src={iconHeart} width="20" height="auto" aria-hidden="true" />
          </div>
        </ThemeSaveButton>

        {headerButton(
          onShareClick,
          iconShare,
          "Share",
          true,
          <React.Fragment>
            {displayShareModal && <ThemeUrl {...props} />}
          </React.Fragment>
        )}

        {hasExtension &&
          headerButton(
            handleExportClick,
            iconExport,
            "Export",
            !isThemeExportInProgress
          )}
      </div>
    </header>
  );
};

export default AppHeader;
