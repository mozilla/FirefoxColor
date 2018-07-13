import React from "react";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

import { colorToCSS } from "../../../../lib/themes";
import { bgImages } from "../../../../lib/assets";
import Metrics from "../../../../lib/metrics";
import { ESC } from "../../../../lib/constants";

const Background = ({
  src,
  backgroundId,
  active,
  setBackground,
  accentcolor
}) => (
  <div
    className={classnames("bg", { active })}
    onClick={() => {
      setBackground({ url: src });
      Metrics.themeChangeBackground(backgroundId);
    }}
  >
    <div
      className="bg__inner"
      style={{
        backgroundColor: accentcolor,
        backgroundImage: `url(${bgImages(src)})`
      }}
    />
  </div>
);

class ThemeBackgroundPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: false
    };
  }

  handleClick = e => {
    if (e.target.classList.contains("theme-background-picker__backgrounds"))
      return;
    this.setState({ selected: !this.state.selected });
  };

  handleClickOutside() {
    this.setState({ selected: false });
  }

  handleKeyPress = event => {
    if (event.keyCode === ESC) {
      this.setState({ selected: false });
    }
  };

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  render() {
    const { theme, setBackground } = this.props;
    const { selected } = this.state;
    const accentcolor = colorToCSS(theme.colors.accentcolor);
    // Note: default theme initializes with no bg so we have to check before adding bg to CSS
    const background = theme.images.additional_backgrounds[0];
    const backgroundSwatch = background ? `url(${bgImages(background)})` : "";
    return (
      <li
        className={classnames("theme-unit", "theme-unit--background", {
          selected
        })}
        onClick={this.handleClick}
      >
        <span className="theme-unit__label" title="Theme Texture">
          Theme Texture
        </span>
        <span
          className="theme-unit__swatch"
          title="Theme Texture"
          style={{
            backgroundColor: accentcolor,
            backgroundImage: backgroundSwatch
          }}
        />
        <div className="theme-unit__picker">
          <div className="theme-unit__picker-inner">
            {bgImages.keys().map((src, backgroundId) => (
              <Background
                key={backgroundId}
                {...{
                  src,
                  backgroundId,
                  accentcolor,
                  setBackground,
                  active: theme.images.additional_backgrounds[0] === src
                }}
              />
            ))}
          </div>
        </div>
      </li>
    );
  }
}

export default onClickOutside(ThemeBackgroundPicker);
