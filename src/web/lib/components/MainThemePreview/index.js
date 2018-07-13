import React from "react";
import BrowserPreview from "../BrowserPreview";
import ThemeUrl from "../ThemeUrl";
import Banner from "../Banner";

import "./index.scss";

export const MainThemePreview = ({
  clipboard,
  selectedColor,
  setSelectedColor,
  theme,
  urlEncodeTheme,
  hasExtension,
  isFirefox,
  addonUrl
}) => (
  <BrowserPreview {...{ theme, size: "large", selectedColor }}>
    {!hasExtension && (
      <Banner
        {...{
          isFirefox,
          addonUrl,
          selectedColor,
          setSelectedColor
        }}
      />
    )}
    {hasExtension && (
      <div className="theme-share-save">
        <ThemeUrl {...{ theme, urlEncodeTheme, clipboard }} />
      </div>
    )}
  </BrowserPreview>
);

export default MainThemePreview;
