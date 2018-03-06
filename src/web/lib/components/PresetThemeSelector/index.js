import React from "react";

import BrowserPreview from "../BrowserPreview";

import { presetThemes } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

export const PresetThemeSelector = ({ setTheme }) => (
  <div className="preset-theme-selector">
    <h2>Choose a preset theme</h2>
    {presetThemes.map((theme, themeId) => {
      return (
        <div key={themeId} title={theme.title} className="preset-theme-preview">
          <BrowserPreview
            {...{
              size: "small",
              theme,
              onClick: () => {
                setTheme({ theme });
                Metrics.themeChangeFull(themeId);
              }
            }}
          />
        </div>
      );
    })}
  </div>
);

export default PresetThemeSelector;
