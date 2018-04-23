import React from "react";
import BrowserPreview from "../BrowserPreview";
import ThemeColorsEditor from "../ThemeColorsEditor";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import UndoRedoButtons from "../UndoRedoButtons";
import ThemeUrl from "../ThemeUrl";
import ThemeSaveButton from "../ThemeSaveButton";

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
  userHasEdited
}) => (
  <BrowserPreview {...{ theme, size: "large" }}>
    <div className="app__theme-element-pickers">
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
    </div>
    <div className="app__controls">
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
  </BrowserPreview>
);

export default ThemeBuilder;
