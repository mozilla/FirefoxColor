import React from "react";

import "./index.scss";

const BrowserTabs = ({
  colors,
  size = "small",
  selectSettings,
  selectedColor = null
}) => {
  const tabs = ["Tab One", "Tab Two"];

  if (size === "large") tabs.push("Tab Three");

  return (
    <div className={`browser-tabs browser-tabs--${size}`}>
      <ul className="browser-tabs__inner">
        {tabs.map((tab, index) => {
          const isTabSelected = index === 0;
          return (
            <li
              key={index}
              className={`browser-tabs__tab ${isTabSelected}`}
              style={{
                backgroundColor: isTabSelected ? colors.toolbar : "transparent",
                color: isTabSelected ? colors.toolbar_text : colors.tab_background_text,
                boxShadow: isTabSelected ? `0 3px ${colors.tab_line} inset` : ""
              }}
            >
              <div className="browser-tabs__tab-inner">
                {isTabSelected &&
                  selectedColor === "tab_line" && (
                    <div
                      className="browser-tabs__tab-line-outline"
                      style={{
                        position: "absolute",
                        top: "-3px",
                        right: "-3px",
                        left: "-3px",
                        height: "9px",
                        outline: selectSettings.active,
                        transition: selectSettings.transition
                      }}
                    />
                  )}
                {isTabSelected &&
                  selectedColor === "toolbar" && (
                    <div
                      className="browser-tabs__tab-select-outline"
                      style={{
                        position: "absolute",
                        top: "-3px",
                        right: "-3px",
                        bottom: "0",
                        left: "-3px",
                        border: selectSettings.active,
                        borderBottom: 0
                      }}
                    />
                  )}
                <span
                  style={{
                    padding: "3px",
                    outline:
                      (isTabSelected && selectedColor === "toolbar_text") ||
                      (!isTabSelected && selectedColor === "tab_background_text")
                        ? selectSettings.active
                        : selectSettings.inactive
                  }}
                >
                  <div
                    className="browser-tabs__title"
                    style={{
                      backgroundColor: isTabSelected
                        ? colors.toolbar_text
                        : colors.tab_background_text
                    }}
                  />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BrowserTabs;
