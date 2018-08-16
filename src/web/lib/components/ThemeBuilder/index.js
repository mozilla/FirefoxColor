import React from "react";
import { DEBUG } from "../../../../lib/utils";

import ThemeLogger from "../ThemeLogger";
import PresetThemeSelector from "../PresetThemeSelector";
import SavedThemeSelector from "../SavedThemeSelector";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import ThemeColorsEditor from "../ThemeColorsEditor";
import { SketchPicker } from "react-color";
import {
  // generateComplementaryTheme,
  distributePalette
} from "../../../../lib/generators";

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
      name: "Generator",
      id: "generator"
    },
    {
      name: "Advanced",
      id: "advanced"
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

  // const handleColorChange = color => {
  //   setTheme({ theme: generateComplementaryTheme(color) });
  // };

  const handleDistributeColorChange = (name, color) => {
    const nextTheme = distributePalette(theme, name, color);
    setTheme({ theme: nextTheme });
  };

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
      case "generator":
        return (
          <div className="generator">
            <h3>Base Color</h3>
            <SketchPicker
              disableAlpha={true}
              color={theme.colors.toolbar}
              onChangeComplete={color =>
                handleDistributeColorChange("base", color.rgb)
              }
            />
            <h3>Accent Color</h3>
            <SketchPicker
              disableAlpha={true}
              color={theme.colors.accentcolor}
              onChangeComplete={color =>
                handleDistributeColorChange("accent", color.rgb)
              }
            />
            <h3>Complement Color</h3>
            <SketchPicker
              disableAlpha={true}
              color={theme.colors.icons}
              onChangeComplete={color =>
                handleDistributeColorChange("complement", color.rgb)
              }
            />
          </div>
        );
      case "advanced":
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
