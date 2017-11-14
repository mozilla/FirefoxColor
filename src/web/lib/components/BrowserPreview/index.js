import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import { defaultColors } from '../../../../lib/constants';
import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

const bgImages = require.context('../../../../images/', false, /bg-.*\.png/);

export default class BrowserPreview extends React.Component {
  render() {
    const { theme, selectedTab = 1 } = this.props;

    const backgroundIndex = 0;

    const colors = {};
    for (let key in theme.colors) {
      colors[key] = colorToCSS(theme.colors[key]);
    }

    const Button = ({ name, colorName = 'toolbar_text' }) => {
      return (
        <span className="button">
          <ReactSVG
            style={{ fill: colors[colorName] }}
            path={`../../../../images/${name}-16.svg`}
          />
        </span>
      );
    };

    const Tab = ({ text, selected }) =>
      <li
        className={classnames('tab', { selected })}
        style={{
          color: selected ? colors.toolbar_text : colors.textcolor,
          backgroundColor: selected ? colors.toolbar : colors.accentcolor
        }}
      >
        <p
          className="title"
          style={{
            color: selected ? colors.toolbar_text : colors.textcolor
          }}
        >
          {text}
        </p>
        <Button name="close" />
      </li>;

    return (
      <div className="doll">
        <div
          className="background"
          style={{
            backgroundImage: `url(${bgImages(`./bg-${backgroundIndex}.png`)})`
          }}
        />
        <ul className="tabbar" style={{ backgroundColor: colors.accentcolor }}>
          {['One', 'Two', 'Three', 'Four'].map((text, key) =>
            <Tab {...{ key, text, colors, selected: key === selectedTab }} />
          )}
        </ul>
        <section
          className="toolbar"
          style={{ backgroundColor: colors.toolbar }}
        >
          <Button name="back" />
          <Button name="forward" />
          <Button name="refresh" />
          <Button name="home" />
          <Button name="sidebar" />
          <span
            className="field"
            style={{
              color: colors.toolbar_field_text,
              backgroundColor: colors.toolbar_field
            }}
          >
            <Button name="info" colorName="toolbar_field_text" />
            <span
              className="location"
              style={{
                color: colors.toolbar_field_text
              }}
            >
              example.com
            </span>
            <Button name="more" colorName="toolbar_field_text" />
            <Button name="bookmark" colorName="toolbar_field_text" />
          </span>
          <Button name="menu" />
        </section>
        <section className="content">
          <p>Hello, world!</p>
        </section>
      </div>
    );
  }
}
