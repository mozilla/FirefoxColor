import React from "react";
import classnames from "classnames";
import { SketchPicker } from "react-color";
import onClickOutside from "react-onclickoutside";
import { colorLabels, colorsWithAlpha, ESC } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";

import "./index.scss";

const DISMISS_CLASSNAMES = ["color__label", "color__swatch"];

class ThemeColorsEditor extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(ev, name) {
    const { selectedColor, setSelectedColor } = this.props;
    const { className } = ev.target;
    if (selectedColor === name && DISMISS_CLASSNAMES.includes(className)) {
      setSelectedColor({ name: null });
    } else {
      setSelectedColor({ name });
    }
  }

  handleClickOutside() {
    const { selectedColor, setSelectedColor } = this.props;
    if (selectedColor !== null) {
      setSelectedColor({ name: null });
    }
  }

  handleKeyPress = event => {
    const { selectedColor, setSelectedColor } = this.props;
    if (event.keyCode === ESC && selectedColor !== null) {
      setSelectedColor({ name: null });
    }
  };

  handleColorChange = (name, color) => {
    this.props.setColor({ name, color: color.rgb });
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  render() {
    const {
      theme: { colors },
      selectedColor
    } = this.props;

    // Select only the color properties from the theme.
    const colorKeys = Object.keys(colors).filter(name => name in colorLabels);

    // Dedupe colors for swatch presets
    const uniqueColorArray = [
      ...new Set(
        colorKeys.map(name => {
          return colorToCSS(colors[name]);
        })
      )
    ];

    return (
      <div className="theme-colors-editor">
        <ul className="theme-colors-editor__list">
          {colorKeys.map((name, idx) => {
            const color = colors[name];
            return [
              <li
                key={`dt-${idx}`}
                className={classnames(name, "theme-unit", "theme-unit--color", {
                  selected: selectedColor === name
                })}
                onClick={ev => this.handleClick(ev, name)}
              >
                <span
                  className="theme-unit__swatch"
                  style={{ backgroundColor: colorToCSS(color) }}
                  title={colorLabels[name]}
                />
                <span className="theme-unit__label" title={colorLabels[name]}>
                  {colorLabels[name]}
                </span>
              </li>
            ];
          })}
        </ul>
        <div className="theme-colors-editor__picker">
          {selectedColor && (
            <SketchPicker
              color={colors[selectedColor]}
              width="270px"
              disableAlpha={!colorsWithAlpha.includes(selectedColor)}
              onChangeComplete={nextColor =>
                this.handleColorChange(selectedColor, nextColor)
              }
              presetColors={uniqueColorArray}
            />
          )}
          {!selectedColor && (
            <div className="theme-colors-editor__prompt">
              <div className="theme-colors-editor__prompt-arrow" />
              <p>Pick a color to start customizing Firefox.</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default onClickOutside(ThemeColorsEditor);
