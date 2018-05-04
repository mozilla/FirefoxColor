import React, { Fragment } from "react";
import BrowserPreview from "../BrowserPreview";
import ThemeColorsEditor from "../ThemeColorsEditor";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import UndoRedoButtons from "../UndoRedoButtons";
import ThemeUrl from "../ThemeUrl";
import ThemeSaveButton from "../ThemeSaveButton";
import Banner from "../Banner";

import "./index.scss";

export const ThemeBuilder = ({
  clipboard,
  modifiedSinceSave,
  redo,
  savedThemes,
  selectedColor,
  setBackground,
  setColor,
  setSelectedColor,
  storage,
  theme,
  themeCanRedo,
  themeCanUndo,
  undo,
  urlEncodeTheme,
  userHasEdited,
  hasExtension,
  justGotExtension,
  isFirefox,
  addonUrl
}) => (
  <BrowserPreview {...{ theme, size: "large" }}>
    <Fragment>
      <ThemeColorsEditor
        {...{
          theme,
          selectedColor,
          setColor,
          setSelectedColor
        }}
      />
      <ThemeBackgroundPicker {...{ theme, setBackground }} />
      {(themeCanUndo || themeCanRedo) && (
        <UndoRedoButtons {...{ undo, redo, themeCanUndo, themeCanRedo }} />
      )}
    </Fragment>
    {!hasExtension && (
      <Banner
        {...{
          isFirefox,
          addonUrl
        }}
      />
    )}
    {hasExtension && (
      <div className="theme-share-save">
        <ThemeUrl {...{ theme, urlEncodeTheme, clipboard }} />
        <ThemeSaveButton
          {...{
            theme,
            savedThemes,
            generateThemeKey: storage.generateThemeKey,
            putTheme: storage.putTheme,
            userHasEdited,
            modifiedSinceSave
          }}
        />
      </div>
    )}
  </BrowserPreview>
);

export default ThemeBuilder;
