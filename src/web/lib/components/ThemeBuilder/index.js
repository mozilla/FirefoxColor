import React from "react";
import { DEBUG } from "../../../../lib/utils";

import ThemeLogger from "../ThemeLogger";
import PresetThemeSelector from "../PresetThemeSelector";
import SavedThemeSelector from "../SavedThemeSelector";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import ThemeColorsEditor from "../ThemeColorsEditor";

import "./index.scss";

export const ThemeBuilder = props => {
  const {
    theme,
    savedThemes,
    hasSavedThemes,
    themeBuilderPanel,
    selectedColor,
    setColor,
    clearColor,
    setSelectedColor,
    setThemeBuilderPanel,
    setTheme,
    savedThemesPage,
    setSavedThemesPage,
    storage,
    themeCustomImages,
    clearCustomBackground,
    hasExtension,
    extensionVersion,
    addonUrl
  } = props;

  const tabList = [
    {
      name: "Preset themes",
      id: "preset-themes"
    },
    {
      name: "Custom colors",
      id: "colors"
    },
    {
      name: "Advanced colors",
      id: "advanced-colors"
    },
    {
      name: "Custom backgrounds",
      id: "backgrounds"
    }
  ];

  if (hasSavedThemes) {
    tabList.push({
      name: `Saved themes (${Object.keys(savedThemes).length})`,
      id: "saved-themes"
    });
  }

  if (DEBUG) {
    tabList.push({
      name: "Raw Theme Data",
      id: "debugger"
    });
  }

  const selectedTabIndex = Math.min(tabList.length - 1, themeBuilderPanel);

  const selectedTabId = tabList[selectedTabIndex].id;

  const renderThemingSection = selected => {
    switch (selected) {
      case "preset-themes":
        return <PresetThemeSelector {...props} />;
      case "colors":
        return (
          <ThemeColorsEditor
            {...{
              theme,
              selectedColor,
              setColor,
              clearColor,
              setSelectedColor
            }}
          />
        );
      case "advanced-colors":
        return (
          <ThemeColorsEditor
            {...{
              theme,
              selectedColor,
              setColor,
              clearColor,
              setSelectedColor,
              advancedColors: true,
              hasExtension,
              extensionVersion,
              addonUrl
            }}
          />
        );
      case "backgrounds":
        return <ThemeBackgroundPicker {...props} />;
      case "saved-themes":
        return (
          <SavedThemeSelector
            {...{
              setTheme,
              savedThemes,
              savedThemesPage,
              setSavedThemesPage,
              themeCustomImages,
              storage,
              clearCustomBackground
            }}
          />
        );
      case "debugger":
        return <ThemeLogger {...{ theme }} />;
      default:
        return null;
    }
  };

  let tabsElement = null;

  const handleKeyUp = e => {
    const currentTab = document.activeElement;
    const currentTabIndex = Array.from(tabsElement.children).indexOf(
      currentTab
    );

    let nextTab = null;

    switch (e.key) {
      case "ArrowLeft": {
        nextTab = tabsElement.children[Math.max(0, currentTabIndex - 1)];
        break;
      }
      case "ArrowRight": {
        nextTab =
          tabsElement.children[
            Math.min(tabList.length - 1, currentTabIndex + 1)
          ];
        break;
      }
      case "Home": {
        nextTab = tabsElement.children[0];
        break;
      }
      case "End": {
        nextTab = tabsElement.children[tabList.length - 1];
        break;
      }
    }

    if (nextTab) {
      currentTab.setAttribute("tabIndex", -1);
      nextTab.setAttribute("tabIndex", 0);
      nextTab.focus();
    }
  };

  return (
    <div className="theme-builder">
      <div className="theme-builder__tabs-wrapper">
        <div
          className="theme-builder__tabs"
          role="tablist"
          ref={el => (tabsElement = el)}
          onKeyUp={handleKeyUp}
        >
          {tabList.map((item, index) => {
            const isSelected =
              selectedTabIndex === index ? "theme-builder__selected" : "";
            return (
              <button
                id={`theme-builder-tab-${item.id}`}
                key={index}
                className={isSelected}
                role="tab"
                tabIndex={selectedTabIndex === index ? 0 : 1}
                aria-selected={selectedTabIndex === index ? "true" : "false"}
                aria-controls={
                  selectedTabIndex === index
                    ? `theme-builder-tab-content-${item.id}`
                    : null
                }
                onClick={() => setThemeBuilderPanel(index)}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </div>
      <div
        id={`theme-builder-tab-content-${selectedTabId}`}
        aria-labelledby={`theme-builder-tab-${selectedTabId}`}
        className="theme-builder__content"
        role="tabpanel"
      >
        {renderThemingSection(selectedTabId)}
      </div>
    </div>
  );
};

export default ThemeBuilder;
