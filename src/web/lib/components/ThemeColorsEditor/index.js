import React from "react";
import classnames from "classnames";
import { SketchPicker } from "react-color";
import onClickOutside from "react-onclickoutside";
import { colorLabels, colorsWithAlpha } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

class ThemeColorsEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false,
      colorName: null
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleClick(name) {
    const { setSelectedColor } = this.props;
    setSelectedColor({ name });
    if (this.state.selected && this.state.colorName !== name) {
      this.setState({selected: this.state.selected, colorName: name });
    } else {
      this.setState({ selected: !this.state.selected, colorName: name });
    }
  }

  handleClickOutside() {
    const { selectedColor, setSelectedColor } = this.props;
    if (selectedColor !== null) {
      setSelectedColor({ name: null });
    }
    this.setState({ selected: false, colorName: null });
  }

  handleKeyPress(event) {
    if (event.keyCode === 27) {
      this.setState({ selected: false, colorName: null });
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

    const {
      selected
    } = this.state;

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
                className={classnames(name, "color", { selected: selected && selectedColor === name })}
                onClick={this.handleClick.bind(this, name)}
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
