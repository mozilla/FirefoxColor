import React from 'react';
import classnames from 'classnames';
import { BlockPicker } from 'react-color';
import onClickOutside from 'react-onclickoutside';
import { colorLabels, colorsWithAlpha } from '../../../../lib/constants';
import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

import iconRedo from './icon_redo.svg';
import iconUndo from './icon_undo.svg';
import iconReset from './icon_reset.svg';

export const UndoRedoButtons = ({
  undo,
  redo,
  themeCanUndo,
  themeCanRedo
}) => (
  <div className="undoRedo">
    <button className={classnames('undo', { disabled: !themeCanUndo })} onClick={undo}>
      <img src={iconUndo} />
    </button>
    <button className={classnames('redo', { disabled: !themeCanRedo })} onClick={redo}>
      <img src={iconRedo} />
    </button>
    <button className="reset">
      <img src={iconReset} />
    </button>
  </div>
);

class ThemeColorsEditor extends React.Component {
  handleClickOutside() {
    this.props.setSelectedColor({ name: null });
  }

  render() {
    const {
      theme: { colors },
      themeCanUndo,
      themeCanRedo,
      selectedColor,
      setColor,
      setSelectedColor,
      undo,
      redo
    } = this.props;

    return (
      <div className="theme-colors-editor">
        <ul className="colors">
          {Object.keys(colors).map((name, idx) => {
            const color = colors[name];
            return [
              <li
                key={`dt-${idx}`}
                className={classnames(name, 'color', { selected: selectedColor === name })}
                onClick={() => setSelectedColor({ name })}
              >
                <span className="color__swatch"style={{ backgroundColor: colorToCSS(color) }} />
                <span className="color__label">{colorLabels[name]}</span>
                <span className="color__picker">
                  <BlockPicker
                    color={{ h: color.h, s: color.s, l: color.l, a: color.a * 0.01 }}
                    disableAlpha={!colorsWithAlpha.includes(name)}
                    onChangeComplete={({ hsl: { h, s, l, a } }) =>
                      setColor({ name, h, s: s * 100, l: l * 100, a: a * 100 })}
                  />
                </span>
              </li>
            ];
          })}
        </ul>
        <UndoRedoButtons {...{ undo, redo, themeCanUndo, themeCanRedo }} />
      </div>
    );
  }
}

export default onClickOutside(ThemeColorsEditor);
