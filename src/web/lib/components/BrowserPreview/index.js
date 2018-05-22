import React from "react";
import ReactSVG from "react-svg";
import classnames from "classnames";

import { colorToCSS } from "../../../../lib/themes";
import { buttonImages, bgImages } from "../../../../lib/assets";

import "./index.scss";

export const BrowserPreview = ({
  size,
  theme,
  selectedTab = 0,
  children = null,
  onClick: onClickDoll = null
}) => {
  const clickDoll = e => {
    if (onClickDoll) {
      onClickDoll(e);
      e.stopPropagation();
    }
    return false;
  };

  const colors = {};
  Object.keys(theme.colors).forEach(key => {
    colors[key] = colorToCSS(theme.colors[key]);
  });

  const Button = ({
    name,
    asset = false,
    colorName = "toolbar_text"
  }) => (
    <span className="doll__button">
      {asset && (
        <ReactSVG
          svgStyle={{ fill: colors[colorName] }}
          path={buttonImages(`./${name}-16.svg`)}
        />
      )}
      {!asset && (
        <div
          className="doll__button-inner"
          style={{ backgroundColor: colors[colorName] }}
        />
      )}
    </span>
  );

  const Tab = ({ text, selected }) => (
    <li
      className={classnames("tab", { selected })}
      style={{
        color: selected ? colors.toolbar_text : colors.textcolor,
        borderTopColor: selected ? colors.tab_line : "transparent",
        backgroundColor: selected ? colors.toolbar : null
      }}
    >
      <p
        className={`title ${text}`}
        style={{
          backgroundColor: selected ? colors.toolbar_text : colors.textcolor
        }}
      />
    </li>
  );

  const headerBackground = theme.images.additional_backgrounds[0];
  const headerBackgroundImage = bgImages
    .keys()
    .includes(headerBackground)
    ? `url(${bgImages(headerBackground)})`
    : "";
  return (
    <div className={`doll doll--${size}`} onClick={clickDoll}>
      <ul
        className="doll__tabbar"
        style={{
          backgroundColor: colors.accentcolor,
          backgroundImage: headerBackgroundImage
        }}
      >
        {["Tab One", "Tab Two"].map((text, key) => (
          <Tab key={key} {...{ text, selected: key === selectedTab }} />
        ))}
      </ul>
      <div
        className="doll__toolbar-wrapper"
        style={{
          backgroundColor: colors.accentcolor,
          backgroundImage: headerBackgroundImage
        }}
      >
        <section
          className="doll__toolbar"
          style={{ backgroundColor: colors.toolbar }}
        >
          <Button name="back" />
          <Button name="forward" />
          <span
            className="doll__field"
            style={{
              color: colors.toolbar_field_text,
              backgroundColor: colors.toolbar_field
            }}
          >
            <span
              className="doll__location"
              style={{
                backgroundColor: colors.toolbar_field_text
              }}
            />
            {size === "large" && (
              <Button
                name="bookmark"
                colorName="toolbar_field_text"
              />
            )}
          </span>
          <Button name="menu" asset={size === "large"} />
        </section>
      </div>
      <section className="doll__content">{children}</section>
    </div>
  );
};

export default BrowserPreview;
