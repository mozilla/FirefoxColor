import React from "react";
import BrowserPreview from "../BrowserPreview";
import ThemeColorsEditor from "../ThemeColorsEditor";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import ThemeCustomBackgroundPicker from "../ThemeCustomBackgroundPicker";
import UndoRedoButtons from "../UndoRedoButtons";
import ThemeUrl from "../ThemeUrl";
import ThemeSaveButton from "../ThemeSaveButton";
import Banner from "../Banner";

import "./index.scss";

export const ThemeBuilder = props => {
  const {
    hasExtension, themeCanUndo, themeCanRedo
  } = props;
  return (
    <BrowserPreview {...{...props, size: "large" }}>
      <div className="app__theme-element-pickers">
        <ThemeColorsEditor {...props} />
        <ThemeBackgroundPicker {...props} />
        {(themeCanUndo || themeCanRedo) && (
          <UndoRedoButtons {...props} />
        )}
      </div>
      {!hasExtension && (
        <Banner {...props} />
      )}
      {hasExtension && (
        <div className="theme-share-save">
          <ThemeUrl {...props} />
          <ThemeSaveButton {...props} />
          <ThemeCustomBackgroundPicker {...props} />
        </div>
      )}
    </BrowserPreview>
  );
};

export default ThemeBuilder;
