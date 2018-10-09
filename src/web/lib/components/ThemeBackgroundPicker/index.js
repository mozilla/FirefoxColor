import React from "react";
import ThemePatternPicker from "../ThemePatternPicker";
import ThemeCustomBackgroundPicker from "../ThemeCustomBackgroundPicker";

import "./index.scss";

export const ThemeBackgroundPicker = props => {
  const { theme, setBackground, themeHasCustomBackgrounds } = props;
  return (
    <div className="theme-background-picker">
      {!themeHasCustomBackgrounds && (
        <ThemePatternPicker {...{ theme, setBackground }} />
      )}
      <ThemeCustomBackgroundPicker {...props} />
    </div>
  );
};

export default ThemeBackgroundPicker;
