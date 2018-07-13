import React from "react";
import { DEBUG } from "../../../../lib/utils";

import ThemeLogger from "../ThemeLogger";
import PresetThemeSelector from "../PresetThemeSelector";
import SavedThemeSelector from "../SavedThemeSelector";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import ThemeColorsEditor from "../ThemeColorsEditor";

import "./index.scss";

export const ThemeBuilder = ({
  theme,
  setTheme,
  savedThemes,
  savedThemesPage,
  setSavedThemesPage,
  hasSavedThemes,
  storage,
  themeBuilderPanel,
  setThemeBuilderPanel,
  setBackground,
  selectedColor,
  setColor,
  setSelectedColor,
  presetThemesPage,
  setPresetThemesPage
}) => {
  const menuItems = [
    {
      name: "Preset themes",
      id: "preset-themes"
    },
    {
      name: "Colors",
      id: "colors"
    },
    {
      name: "Images & textures",
      id: "images-and-textures"
    }
  ];

  if (hasSavedThemes) {
    menuItems.push({
      name: `Saved themes (${Object.keys(savedThemes).length})`,
      id: "saved-themes"
    });
  }

  if (DEBUG) {
    menuItems.push({
      name: "Raw Theme Data",
      id: "debugger"
    });
  }

  const renderThemingSection = selected => {
    switch (selected) {
      case "preset-themes":
        return (
          <PresetThemeSelector
            {...{
              setTheme,
              presetThemesPage,
              setPresetThemesPage
            }}
          />
        );
      case "colors":
        return (
          <ThemeColorsEditor
            {...{
              theme,
              selectedColor,
              setColor,
              setSelectedColor
            }}
          />
        );
      case "images-and-textures":
        return <ThemeBackgroundPicker {...{ theme, setBackground }} />;
      case "saved-themes":
        return (
          <SavedThemeSelector
            {...{
              setTheme,
              savedThemes,
              savedThemesPage,
              setSavedThemesPage,
              deleteTheme: storage.deleteTheme
            }}
          />
        );
      case "debugger":
        return <ThemeLogger {...{ theme }} />;
      default:
        return null;
    }
  };

  return (
    <div className="theme-builder">
      <div className="theme-builder__tabs-wrapper">
        <ul className="theme-builder__tabs">
          {menuItems.map((item, index) => {
            const isSelected =
              themeBuilderPanel === index ? "theme-builder__selected" : "";
            return (
              <li
                key={index}
                className={isSelected}
                onClick={() => setThemeBuilderPanel(index)}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="theme-builder__content">
        {renderThemingSection(menuItems[themeBuilderPanel].id)}
      </div>
    </div>
  );
};

export default ThemeBuilder;
