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
    this.props.setColor({ name, color: color.rgb });
  };

  handleClearColor = (name) => {
    const { setSelectedColor } = this.props;
    this.props.clearColor({name});
    setSelectedColor({ name: null });
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
    const updatedExtensionVersion = extensionVersion && semverCompare(extensionVersion, requiredVersion) >= 0;

    // Select only the color properties from the theme.
    const colorKeys = Object.keys(labels);

    // Dedupe colors for swatch presets
    const uniqueColorArray = [
      ...new Set(
        Object.keys(Object.assign({}, colorLabels, advancedColorLabels)).map(name => {
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
                  {color ?
                    <span
                      className="theme-unit__swatch"
                      style={{backgroundColor: colorToCSS(color)}}
                      title={labels[name]}
                    />
                    : <span
                      className="theme-unit__default"
                      title={labels[name]}
                    />
                  }

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
          {selectedColor && (
            <div>
              <SketchPicker
                color={colors[selectedColor]}
                width="270px"
                disableAlpha={!colorsWithAlpha.includes(selectedColor)}
                onChangeComplete={nextColor =>
                  this.handleColorChange(selectedColor, nextColor)
                }
                presetColors={uniqueColorArray}
              />
              {advancedColors &&
                <button className={"use-default"}
                        title="Use Firefox&quot;s default style for this color"
                        onClick={ev => this.handleClearColor(selectedColor)}/>
              }
            </div>
          )}
          {!selectedColor && (
            <div className="theme-colors-editor__prompt">
              <div className="theme-colors-editor__prompt-arrow" />
              <div className="theme-colors-editor__prompt-description" >
                {!advancedColors &&
                  <p>Pick a color to start customizing Firefox.</p>
                }
                {advancedColors && hasExtension && updatedExtensionVersion &&
                  <div>
                    <p>Advanced colors are previewed in Firefox instead of this page.</p>
                  </div>
                }
                {advancedColors && hasExtension && !updatedExtensionVersion &&
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
              </div>
            </div>
          )}
        </div>
      </div >
    );
  }
}

export default onClickOutside(ThemeColorsEditor);
