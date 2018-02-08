import React from 'react';
import classnames from 'classnames';
import { SketchPicker } from 'react-color';
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

export default class ThemeColorsEditor extends React.Component {
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
        <dl className="colors">
          {Object.keys(colors).map((name, idx) => {
            const color = colors[name];
            return [
              <dt
                key={`dt-${idx}`}
                className={classnames({ selected: selectedColor === name })}
                onClick={() => setSelectedColor({ name })}
              >
                <span style={{ backgroundColor: colorToCSS(color) }} />
                {colorLabels[name]}
              </dt>,
              <dd
                key={`dd-${idx}`}
                className={classnames({ selected: selectedColor === name })}
              >
                <SketchPicker
                  color={{ h: color.h, s: color.s, l: color.l, a: color.a * 0.01 }}
                  disableAlpha={!colorsWithAlpha.includes(name)}
                  onChangeComplete={({ hsl: { h, s, l, a } }) =>
                    setColor({ name, h, s: s * 100, l: l * 100, a: a * 100 })}
                />
              </dd>
            ];
          })}
        </dl>
        <UndoRedoButtons {...{ undo, redo, themeCanUndo, themeCanRedo }} />
      </div>
    );
  }
}
