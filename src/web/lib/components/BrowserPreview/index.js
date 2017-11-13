import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';

import './index.scss';

const bgImages = require.context('../../../../images/', false, /bg-.*\.png/);

export default class BrowserPreview extends React.Component {
  render() {
    const { backgroundIndex, colors, selectedTab = 1 } = this.props;

    const Button = ({ name, children }) => {
      return (
        <span className="button">
          <ReactSVG
            style={{ fill: colors.toolbar_text }}
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
            <span
              className="location"
              style={{
                color: colors.toolbar_field_text
              }}
            >
              example.com
            </span>
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
