import React from "react";

import "./index.scss";

const BrowserPopup = ({
  colors,
  size = "small",
  selectSettings,
  selectedColor
}) => {
  const items = ["item one", "item two"];
  if (size === "large") {
    items.push("item three");
  }
  return (
    <div className={`browser-popup browser-popup--${size}`}>
      <div
        className="browser-popup__caret-shadow"
        style={{
          transition: selectSettings.transition,
          outline:
            selectedColor === "popup"
              ? selectSettings.active
              : selectSettings.inactive
        }}
      />
      <div
        className="browser-popup__caret"
        style={{
          background: colors.popup
        }}
      />
      <ul
        className="browser-popup__inner"
        style={{
          background: colors.popup,
          transition: selectSettings.transition,
          outline:
            selectedColor === "popup"
              ? selectSettings.active
              : selectSettings.inactive
        }}
      >
        {items.map((item, index) => {
          return (
            <li
              key={index}
              style={{
                padding: "1px",
                transition: selectSettings.transition,
                outline:
                  selectedColor === "popup_text"
                    ? selectSettings.active
                    : selectSettings.inactive
              }}
            >
              <div
                className="browser-popup__item"
                style={{
                  background: colors.popup_text
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BrowserPopup;
