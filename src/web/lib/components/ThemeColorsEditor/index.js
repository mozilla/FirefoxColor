import React from 'react';
import ReactSVG from 'react-svg';
import classnames from 'classnames';
import { SketchPicker } from 'react-color';

import { colorLabels, defaultColors } from '../../../../lib/constants';
import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

export default class ThemeColorsEditor extends React.Component {
  render() {
    const {
      theme: { colors },
      selectedColor,
      setColor,
      setSelectedColor
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
                style={{ backgroundColor: colorToCSS(color) }}
              >
                {colorLabels[name]}
              </dt>,
              <dd
                key={`dd-${idx}`}
                className={classnames({ selected: selectedColor === name })}
              >
                <SketchPicker
                  color={color}
                  onChangeComplete={({ hsl: { h, s, l, a } }) =>
                    setColor({ name, h, s: s * 100, l: l * 100, a: a * 100 })}
                />
              </dd>
            ];
          })}
        </dl>
      </div>
    );
  }
}
