import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { defaultColors } from '../../../../lib/constants';
import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

const bgImages = require.context('../../../../images/', false, /bg-.*\.png/);

export const BrowserPreview = ({
  theme,
  selectedColor,
  setSelectedColor,
  selectedTab = 1
}) => {
  const clickSelectColor = name => e => {
    setSelectedColor({ name });
    e.stopPropagation();
    return false;
  };

  const colors = {};
  for (let key in theme.colors) {
    colors[key] = colorToCSS(theme.colors[key]);
  }

  const Button = ({
    name,
    onClick = clickSelectColor('toolbar_text'),
    colorName = 'toolbar_text'
  }) =>
    <span className="button" onClick={onClick}>
      <ReactSVG
        style={{ fill: colors[colorName] }}
        path={`../../../../images/${name}-16.svg`}
      />
    </span>;

  const Tab = ({ text, selected }) =>
    <li
      className={classnames('tab', { selected })}
      onClick={clickSelectColor(selected ? 'toolbar' : 'accentcolor')}
      style={{
        color: selected ? colors.toolbar_text : colors.textcolor,
        backgroundColor: selected ? colors.toolbar : null
      }}
    >
      <p
        className="title"
        onClick={clickSelectColor(selected ? 'toolbar_text' : 'textcolor')}
        style={{
          color: selected ? colors.toolbar_text : colors.textcolor
        }}
      >
        {text}
      </p>
      <Button name="close" />
    </li>;

  const headerBackgroundImage = bgImages
    .keys()
    .includes(theme.images.headerURL)
    ? `url(${bgImages(theme.images.headerURL)})`
    : '';

  return (
    <div className="doll">
      <ul
        className="tabbar"
        onClick={clickSelectColor('accentcolor')}
        style={{
          backgroundColor: colors.accentcolor,
          backgroundImage: headerBackgroundImage
        }}
      >
        {['One', 'Two', 'Three', 'Four'].map((text, key) =>
          <Tab {...{ key, text, colors, selected: key === selectedTab }} />
        )}
      </ul>
      <section
        className="toolbar"
        onClick={clickSelectColor('toolbar')}
        style={{ backgroundColor: colors.toolbar }}
      >
        <Button name="back" />
        <Button name="forward" />
        <Button name="refresh" />
        <Button name="home" />
        <Button name="sidebar" />
        <span
          className="field"
          onClick={clickSelectColor('toolbar_field')}
          style={{
            color: colors.toolbar_field_text,
            backgroundColor: colors.toolbar_field
          }}
        >
          <Button
            name="info"
            onClick={clickSelectColor('toolbar_field_text')}
            colorName="toolbar_field_text"
          />
          <span
            className="location"
            onClick={clickSelectColor('toolbar_field_text')}
            style={{
              color: colors.toolbar_field_text
            }}
          >
            example.com
          </span>
          <Button
            name="more"
            onClick={clickSelectColor('toolbar_field_text')}
            colorName="toolbar_field_text"
          />
          <Button
            name="bookmark"
            onClick={clickSelectColor('toolbar_field_text')}
            colorName="toolbar_field_text"
          />
        </span>
        <Button name="menu" />
      </section>
      <section className="content">
        <p>Hello, world!</p>
      </section>
    </div>
  );
};

export default BrowserPreview;
