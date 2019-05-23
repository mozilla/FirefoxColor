import React from "react";
import ReactSVG from "react-svg";

import { buttonImages } from "../../../../lib/assets";

import "./index.scss";

export const BrowserTools = ({
  colors,
  size = "small",
  selectSettings,
  selectedColor = null
}) => {
  const Button = ({ name, asset = false, colorName = "bookmark_text" }) => (
    <span
      className="browser-tools__button"
      style={{
        transition: selectSettings.transition,
        outline:
          selectedColor === colorName
            ? selectSettings.active
            : selectSettings.inactive
      }}
    >
      {asset && (
        <ReactSVG
          svgStyle={{ fill: colors[colorName] }}
          src={buttonImages(`./${name}-16.svg`)}
        />
      )}
      {!asset && (
        <div
          className="browser-tools__button-inner"
          style={{ backgroundColor: colors[colorName] }}
        />
      )}
    </span>
  );

  return (
    <div className={`browser-tools browser-tools--${size}`}>
      <div
        className="browser-tools__inner"
        style={{
          backgroundColor: colors.toolbar,
          transition: selectSettings.transition,
          outline:
            selectedColor === "toolbar"
              ? selectSettings.active
              : selectSettings.inactive
        }}
      >
        <Button name="back" />
        <Button name="forward" />
        <div
          className="browser-tools__field"
          style={{
            backgroundColor: colors.toolbar_field,
            transition: selectSettings.transition,
            outline:
              selectedColor === "toolbar_field"
                ? selectSettings.active
                : selectSettings.inactive
          }}
        >
          <span
            className="browser-tools__field-text"
            style={{
              backgroundColor: colors.toolbar_field_text,
              transition: selectSettings.transition,
              outline:
                selectedColor === "toolbar_field_text"
                  ? selectSettings.active
                  : selectSettings.inactive
            }}
          />
          {size === "large" && (
            <Button name="bookmark" colorName="toolbar_field_text" />
          )}
        </div>
        <Button name="menu" asset={size === "large"} />
      </div>
    </div>
  );
};

export default BrowserTools;
