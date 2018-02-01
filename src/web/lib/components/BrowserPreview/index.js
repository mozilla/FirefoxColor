import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

const bgImages = require.context('../../../../images/', false, /bg-.*\.png/);
const buttonImages = require.context('../../../../images/', false, /.*-16\.svg/);

export const BrowserPreview = ({
  theme,
  setSelectedColor,
  selectedTab = 0
}) => {
  const clickSelectColor = name => e => {
    setSelectedColor({ name });
    e.stopPropagation();
    return false;
  };

  const colors = {};
  Object.keys(theme.colors).forEach(key => {
    colors[key] = colorToCSS(theme.colors[key]);
  });

  const Button = ({
    name,
    asset = false,
    onClick = clickSelectColor('toolbar_text'),
    colorName = 'toolbar_text'
  }) =>
    <span className="button" onClick={onClick}>
      {asset && <ReactSVG
        style={{ fill: colors[colorName] }}
        path={buttonImages(`./${name}-16.svg`)}
      />}
      {!asset && <div className="button-inner"
        style={{ backgroundColor: colors[colorName] }}
      />}
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
        className={`title ${text}`}
        onClick={clickSelectColor(selected ? 'toolbar_text' : 'textcolor')}
        style={{
          backgroundColor: selected ? colors.toolbar_text : colors.textcolor
        }}
      >
      </p>
    </li>;

  const headerBackgroundImage = bgImages.keys().includes(theme.images.headerURL)
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
        {['One', 'Two', 'Three'].map((text, key) =>
          <Tab key={key} {...{ text, selected: key === selectedTab }} />
        )}
      </ul>
      <div
        className="toolbar-wrapper"
        style={{
          backgroundColor: colors.accentcolor,
          backgroundImage: headerBackgroundImage,
          backgroundPositionY: '-80'
        }}>
        <section
          className="toolbar"
          onClick={clickSelectColor('toolbar')}
          style={{ backgroundColor: colors.toolbar }}
        >
          <Button name="back" />
          <Button name="forward" />
          <span
            className="field"
            onClick={clickSelectColor('toolbar_field')}
            style={{
              color: colors.toolbar_field_text,
              backgroundColor: colors.toolbar_field
            }}
          >
            <span
              className="location"
              onClick={clickSelectColor('toolbar_field_text')}
              style={{
                backgroundColor: colors.toolbar_field_text
              }}
            />
            <Button
              name="bookmark"
              onClick={clickSelectColor('toolbar_field_text')}
              colorName="toolbar_field_text"
            />
          </span>
          <Button name="menu" asset={ true }/>
        </section>
      </div>
      <section className="content">
        <form className="theme-url-generator">
          <label>Share your theme:</label>
          <fieldset>
            <input type="text" value="https://mythemerules.com" />
            <input type="submit" value="Copy" />
          </fieldset>
        </form>
      </section>
    </div>
  );
};

export default BrowserPreview;
