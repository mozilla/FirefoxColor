import React from "react";

import "./index.scss";

const BrowserChrome = ({
  colors,
  headerBackgroundImage,
  customImages,
  children,
  selectSettings,
  themeHasCustomBackgrounds,
  selectedColor = false
}) => {
  return (
    <div
      className="browser-chrome"
      style={{
        backgroundImage: !themeHasCustomBackgrounds
          ? headerBackgroundImage
          : null,
        backgroundColor: colors.frame
      }}
    >
      {customImages.map((image, index) => {
        return (
          <div
            className="browser-chrome__custom-image"
            key={index}
            style={{
              backgroundImage: `url(${image.image})`,
              backgroundRepeat: `${image.tiling}`,
              backgroundPosition: `${image.alignment}`,
              position: "absolute",
              height: "100%",
              width: "100%",
              backgroundSize: "50% auto",
              zIndex: 4 - index
            }}
          />
        );
      })}
      {children}
    </div>
  );
};

export default BrowserChrome;
