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

  React.useEffect(() => {
    syncImages();
  }, [props.presentImages]);

  const handleExportClick = () => {
    showExportThemeDialog(true);
  };

  const onShareClick = () => {
    setDisplayShareModal({ display: !displayShareModal });
  };

  // sync images in local storage with custom backgrounds in preview on undo/redo
  const syncImages = () => {
    const localStorageKeys = Object.keys(localStorage);

    const imagesInStorage = localStorageKeys.filter(key => {
      if (key.startsWith("IMAGE-")) return key;
      return false;
    }).map(item => item.substring(6));

    const customImages = props.presentImages.custom_backgrounds || [];
    let previewImages = JSON.stringify(customImages);

    imagesInStorage.forEach((_, i) => {
      if (!previewImages.includes(imagesInStorage[i])) {
        props.deleteImages([imagesInStorage[i]]);
      }
    });
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
