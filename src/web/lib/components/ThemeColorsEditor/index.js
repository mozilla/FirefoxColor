import classnames from "classnames";
import React from "react";
import { SketchPicker } from "react-color";
import onClickOutside from "react-onclickoutside";
import semverCompare from "semver-compare";
import {
  advancedColorLabels,
  colorLabels,
  colorsWithoutAlpha,
  ESC
} from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import StorageSpaceInformation from "../StorageSpaceInformation";

import "./index.scss";

const DISMISS_CLASSNAMES = ["color__label", "color__swatch"];

class ThemeColorsEditor extends React.Component {
  constructor(props) {
    super(props);

    this.colorPickerRef = React.createRef();
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
    this.props.setColor({ name, color });
  };

  handleClearColor = name => {
    this.props.clearColor({ name });
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
      selectedColor,
      advancedColors,
      hasExtension,
      extensionVersion,
      addonUrl
    } = this.props;

    const labels = advancedColors ? advancedColorLabels : colorLabels;

    let requiredVersion = "2.1.6";
    const hasAdvancedThemeSupport =
      extensionVersion && semverCompare(extensionVersion, requiredVersion) >= 0;

    // Select only the color properties from the theme.
    const colorKeys = Object.keys(labels);

    // Dedupe colors for swatch presets
    const uniqueColorArray = [
      ...new Set(
        Object.keys({ ...colorLabels, ...advancedColorLabels }).map(name => {
          return colorToCSS(colors[name]);
        })
      )
    ];

    const selectedColorValue = colors[selectedColor];
    if (selectedColorValue) {
      // Remember last selected color incase the user closes and re-opens the color picker.
      this.lastSelectedColor = selectedColorValue;
    }

    return (
      <div className="theme-colors-editor">
        <div className="theme-colors-editor-main">
          <ul className="theme-colors-editor__list">
            {colorKeys.map((name, idx) => {
              const color = colors[name];
              return [
                <li
                  key={`dt-${idx}`}
                  className={classnames(
                    name,
                    "theme-unit",
                    "theme-unit--color",
                    {
                      selected: selectedColor === name
                    }
                  )}
                  onClick={ev => this.handleClick(ev, name)}
                >
                  <span
                    className="theme-unit__swatch"
                    style={
                      color
                        ? { backgroundColor: colorToCSS(color) }
                        : { borderStyle: "dashed" }
                    }
                    title={labels[name]}
                  />

                  <span className="theme-unit__label" title={labels[name]}>
                    {labels[name]}
                  </span>
                </li>
              ];
            })}
          </ul>
          <StorageSpaceInformation />
        </div>
        <div className="theme-colors-editor__picker">
          {selectedColor && advancedColors && (
            <div className="theme-colors-editor__options">
              <label>
                <input
                  type="radio"
                  value="default"
                  checked={!selectedColorValue}
                  onChange={ev => this.handleClearColor(selectedColor)}
                />
                use Firefox&#39;s default style
              </label>
              <label>
                <input
                  type="radio"
                  value="other"
                  checked={!!selectedColorValue}
                  onChange={ev =>
                    this.handleColorChange(
                      selectedColor,
                      this.colorPickerRef.current.state.rgb
                    )
                  }
                />
                or select a color:
              </label>
            </div>
          )}
          {selectedColor && (
            <SketchPicker
              className={
                advancedColors && !selectedColorValue
                  ? "theme-colors-editor__disabled"
                  : ""
              }
              color={selectedColorValue || this.lastSelectedColor}
              width="270px"
              disableAlpha={colorsWithoutAlpha.includes(selectedColor)}
              onChangeComplete={nextColor =>
                this.handleColorChange(selectedColor, nextColor.rgb)
              }
              presetColors={uniqueColorArray}
              ref={this.colorPickerRef}
            />
          )}
          {!selectedColor && (
            <div className="theme-colors-editor__prompt">
              <div className="theme-colors-editor__prompt-arrow" />
              <div className="theme-colors-editor__prompt-description">
                {!advancedColors && (
                  <p>Pick a color to start customizing Firefox.</p>
                )}
                {advancedColors && hasExtension && hasAdvancedThemeSupport && (
                  <div>
                    <p>
                      Advanced colors are previewed in Firefox instead of this
                      page.
                    </p>
                  </div>
                )}
                {advancedColors && hasExtension && !hasAdvancedThemeSupport && (
                  <div>
                    <p>
                      Please update your{" "}
                      <a href={addonUrl}>Firefox Color extension</a> to version{" "}
                      {requiredVersion} or higher if you want to use this
                      feature.
                    </p>
                  </div>
                )}
                {advancedColors && !hasExtension && (
                  <div>
                    <p>
                      Advanced colors are not shown in the preview on this page.
                    </p>
                    <p>
                      Install the <a href={addonUrl}>Firefox Color extension</a>{" "}
                      to experience the full preview.
                    </p>
                  </div>
                )}
                <p>
                  Learn more about each property from the{" "}
                  <a href="https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme#colors">
                    official documentation
                  </a>
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default onClickOutside(ThemeColorsEditor);
