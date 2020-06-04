import React from "react";
import classnames from "classnames";
import { SketchPicker } from "react-color";
import onClickOutside from "react-onclickoutside";
import { colorsWithAlpha, ESC, colorLabels, advancedColorLabels } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import StorageSpaceInformation from "../StorageSpaceInformation";
import semverCompare from "semver-compare";

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
    this.lastSelectedColor = color;
    this.props.setColor({ name, color });
  };

  handleClearColor = (name) => {
    const { theme: {colors} } = this.props;
    this.lastSelectedColor = colors[name];
    this.props.clearColor({name});
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
    const hasAdvancedThemeSupport = extensionVersion && semverCompare(extensionVersion, requiredVersion) >= 0;

    // Select only the color properties from the theme.
    const colorKeys = Object.keys(labels);

    // Dedupe colors for swatch presets
    const uniqueColorArray = [
      ...new Set(
        Object.keys({...colorLabels, ...advancedColorLabels}).map(name => {
          return colorToCSS(colors[name]);
        })
      )
    ];

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
                    style={color ? {backgroundColor: colorToCSS(color)} : {borderStyle: "dashed"}}
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
          {selectedColor && advancedColors && 
            <div className="theme-colors-editor__options">
              <label>
                <input type="radio" value="default" checked={!colors[selectedColor]}
                        onChange={ev => this.handleClearColor(selectedColor)}/>
                use Firefox&#39;s default style for this color
              </label>
              <label>
                <input type="radio" value="other" checked={!!colors[selectedColor]}
                        onChange={ev =>
                          this.handleColorChange(selectedColor, this.lastSelectedColor)
                        }/>
                or select a color:
              </label>
            </div>           
          }
          {selectedColor &&
            <SketchPicker
              className={advancedColors && !colors[selectedColor] ? "theme-colors-editor__disabled" : ""}
              color={colors[selectedColor] || this.lastSelectedColor}
              width="270px"
              disableAlpha={!colorsWithAlpha.includes(selectedColor)}
              onChangeComplete={nextColor =>
                this.handleColorChange(selectedColor, nextColor.rgb)
              }
              presetColors={uniqueColorArray}
            />
          }
          {!selectedColor && (
            <div className="theme-colors-editor__prompt">
              <div className="theme-colors-editor__prompt-arrow" />
              <div className="theme-colors-editor__prompt-description" >
                {!advancedColors &&
                  <p>Pick a color to start customizing Firefox.</p>
                }
                {advancedColors && hasExtension && hasAdvancedThemeSupport &&
                  <div>
                    <p>Advanced colors are previewed in Firefox instead of this page.</p>
                  </div>
                }
                {advancedColors && hasExtension && !hasAdvancedThemeSupport &&
                <div>
                  <p>Please update your <a href={addonUrl}>Firefox Color extension</a> to version {requiredVersion} or higher if you want to use this feature.</p>
                </div>
                }
                {advancedColors && !hasExtension &&
                  <div>
                    <p>Advanced colors are not shown in the preview on this page.</p>
                    <p>Install the <a href={addonUrl}>Firefox Color extension</a> to experience the full preview.</p>
                  </div>
                }
                <p>Learn more about each property from the <a href="https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/manifest.json/theme#colors">official documentation</a>.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default onClickOutside(ThemeColorsEditor);
