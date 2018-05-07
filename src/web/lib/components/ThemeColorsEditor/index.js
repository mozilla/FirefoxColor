import React from "react";
import classnames from "classnames";
import { SketchPicker } from "react-color";
import onClickOutside from "react-onclickoutside";
import { colorLabels, colorsWithAlpha, ESC } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

const DISMISS_CLASSNAMES = ["color__label", "color__swatch"];

class ThemeColorsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
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

  handleKeyPress(event) {
    const { selectedColor, setSelectedColor } = this.props;
    if (event.keyCode === ESC && selectedColor !== null) {
      setSelectedColor({ name: null });
    }
  }

  handleColorChange(name, color) {
    this.props.setColor({ name, color: color.rgb });
    Metrics.themeChangeColor(name);
  }

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
        <ul className="colors">
          {colorKeys.map((name, idx) => {
            const color = colors[name];
            return [
              <li
                key={`dt-${idx}`}
                className={classnames(name, "color", {
                  selected: selectedColor === name
                })}
                onClick={ev => this.handleClick(ev, name)}
              >
                <span
                  className="color__swatch"
                  style={{ backgroundColor: colorToCSS(color) }}
                  title={colorLabels[name]}
                />
                <span className="color__label" title={colorLabels[name]}>
                  {colorLabels[name]}
                </span>
                <span className="color__picker">
                  <SketchPicker
                    color={color}
                    disableAlpha={!colorsWithAlpha.includes(name)}
                    onChangeComplete={color =>
                      this.handleColorChange(name, color)
                    }
                    presetColors={uniqueColorArray}
                  />
                </span>
              </li>
            ];
          })}
        </ul>
      </div>
    );
  }
}

export default onClickOutside(ThemeColorsEditor);
