import React from "react";
import ThemePatternPicker from "../ThemePatternPicker";
import ThemeCustomBackgroundPicker from "../ThemeCustomBackgroundPicker";
import StorageSpaceInformation from "../StorageSpaceInformation";

import "./index.scss";

export const ThemeBackgroundPicker = props => {
  const { theme, setBackground, themeHasCustomBackgrounds } = props;
  return (
    <div className="theme-background-picker">
      <div className="theme-background-picker-form">
        {!themeHasCustomBackgrounds && (
          <ThemePatternPicker {...{ theme, setBackground }} />
        )}
        <ThemeCustomBackgroundPicker {...props} />
      </div>
      <StorageSpaceInformation />
    </div>
  );
};

export default ThemeBackgroundPicker;
