import React from "react";
import BrowserChrome from "../BrowserChrome";
import BrowserTabs from "../BrowserTabs";
import BrowserTools from "../BrowserTools";
import BrowserPopup from "../BrowserPopup";

import { colorToCSS } from "../../../../lib/themes";
import { bgImages } from "../../../../lib/assets";

import "./index.scss";

const Browser = ({
  theme,
  themeHasCustomBackgrounds = null,
  customImages = [],
  size = "small",
  selectedColor = null,
  children = null,
  onClick: onClickBrowser = null,
  showPopup = true
}) => {
  const clickBrowser = e => {
    if (onClickBrowser) {
      onClickBrowser(e);
      e.stopPropagation();
    }
    return false;
  };

  // get all the colors to pass into various browser bits
  const colors = {};
  Object.keys(theme.colors).forEach(key => {
    colors[key] = colorToCSS(theme.colors[key]);
  });

  // now do the backgrounds
  const headerBackground = theme.images.additional_backgrounds[0];
  const headerBackgroundImage = bgImages.keys().includes(headerBackground)
    ? `url(${bgImages(headerBackground)})`
    : "";

  const selectSettings = {
    transition: "outline 250ms",
    active: "3px dashed red",
    inactive: "3px dashed transparent"
  };

  return (
    <div className={`browser browser--${size}`} onClick={clickBrowser}>
      <BrowserChrome
        {...{
          colors,
          headerBackgroundImage,
          customImages,
          selectedColor,
          selectSettings,
          themeHasCustomBackgrounds
        }}
      >
        <div
          style={{
            transition: selectSettings.transition,
            outline:
              selectedColor === "frame"
                ? selectSettings.active
                : selectSettings.inactive
          }}
        >
          <BrowserTabs
            {...{
              colors,
              size,
              selectSettings,
              selectedColor
            }}
          />
          <BrowserTools {...{ colors, size, selectSettings, selectedColor }} />
        </div>
        {showPopup && (
          <BrowserPopup {...{ colors, size, selectSettings, selectedColor }} />
        )}
      </BrowserChrome>
      <div className="browser__content">{children}</div>
    </div>
  );
};

export default Browser;
