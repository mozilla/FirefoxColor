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
import { temporaryImageStore } from "../../middleware";
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

  const [shouldUpdate, setUpdate] = React.useState(false);

  React.useEffect(() => {
    if (shouldUpdate) {
      syncImages();
    }
  }, [shouldUpdate]);


  const handleExportClick = () => {
    showExportThemeDialog(true);
  };

  const onShareClick = () => {
    setDisplayShareModal({ display: !displayShareModal });
  };

  // sync images in local storage with custom backgroundsin preview/saved themes on undo/redo
  const syncImages = () => {
    let currentImages = new Set();

    props.themeCustomBackgrounds
      .forEach(({ name }) => { 
        currentImages.add(name);
        const image = temporaryImageStore.get(name);
        if (image) {
          props.updateImage({ ...image, importing: true });
          props.updateCustomBackground({ name });
        }
      });

    let savedImagesInThemes = new Set();

    Object.values(props.savedThemes).forEach(({ theme }) => {
      (theme.images.custom_backgrounds || []).forEach(bg => {
        savedImagesInThemes.add(bg.name);
      });
    });

    const toDelete = [];
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith("IMAGE-")) {
        const name = key.substring(6);
        // If an image isnt found in the current custom background images list and isn't in any
        // saved theme we can delete the image from local storage on undo/redo.
        if (!currentImages.has(name) && !savedImagesInThemes.has(name)) {
          toDelete.push(name);
        }
      }
    });

    if (toDelete.length) {
      props.deleteImages(toDelete);
    }
    setUpdate(false);
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

  const withUpdate = onClickButton => {
    onClickButton();
    setUpdate(true);
  };

  return (
    <header className="app-header">
      <div className="app-header__content">
        <div className="app-header__icon" />
        <div>
          <h1>Firefox Color</h1>
        </div>
      </div>
      <div className="app-header__controls">
        {headerButton(withUpdate.bind(null, undo), iconUndo, "Undo", themeCanUndo)}
        {headerButton(withUpdate.bind(null, redo), iconRedo, "Redo", themeCanRedo)}
        {headerButton(withUpdate.bind(null, handleRandomClick), iconRandomize, "Random")}

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
