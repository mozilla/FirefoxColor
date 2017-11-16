import React from 'react';
import classnames from 'classnames';
import { SketchPicker } from 'react-color';

import { colorLabels } from '../../../../lib/constants';
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
                  color={{ h: color.h, s: color.s, l: color.l, a: color.a * 0.01 }}
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
