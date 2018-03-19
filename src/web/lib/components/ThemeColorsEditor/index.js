import React from "react";
import classnames from "classnames";
import { SketchPicker } from "react-color";
import onClickOutside from "react-onclickoutside";
import { colorLabels, colorsWithAlpha, ESC } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

class ThemeColorsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleClick(name) {
    const { selectedColor, setSelectedColor } = this.props;
    if (selectedColor === name) {
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
    if (event.keyCode === ESC) {
      if (selectedColor !== null) {
        setSelectedColor({ name: null });
      }
    }
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
      selectedColor,
      setColor
    } = this.props;

    // Select only the color properties from the theme.
    const colorKeys = Object.keys(colors)
      .filter(name => name in colorLabels);

    return (
      <div className="theme-colors-editor">
        <ul className="colors">
          {colorKeys.map((name, idx) => {
            const color = colors[name];
            return [
              <li
                key={`dt-${idx}`}
                className={classnames(name, "color", { selected: this.props.selectedColor && selectedColor === name })}
                onClick={() => this.handleClick(name)}
                title={colorLabels[name]}
              >
                <span className="color__swatch"style={{ backgroundColor: colorToCSS(color) }} />
                <span className="color__label">{colorLabels[name]}</span>
                <span className="color__picker">
                  <SketchPicker
                    color={{ h: color.h, s: color.s, l: color.l, a: color.a * 0.01 }}
                    disableAlpha={!colorsWithAlpha.includes(name)}
                    onChangeComplete={({ hsl: { h, s, l, a } }) => {
                      const newColor = { name, h, s: s * 100, l: l * 100};
                      if (colorsWithAlpha.includes(name)) {
                        newColor.a = a * 100;
                      }
                      setColor(newColor);
                      Metrics.themeChangeColor(name);
                    }}
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
