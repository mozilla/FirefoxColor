import React from "react";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

import { colorToCSS } from "../../../../lib/themes";
import { bgImages } from "../../../../lib/assets";
import Metrics from "../../../../lib/metrics";
import { ESC } from "../../../../lib/constants";
import "./index.scss";

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
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  handleClick() {
    this.setState({ selected: !this.state.selected });
  }

  handleClickOutside() {
    this.setState({ selected: false });
  }

  handleKeyPress(event) {
    if (event.keyCode === ESC) {
      this.setState({ selected: false });
    }
  }

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
      <div
        className={classnames("theme-background-picker", { selected })}
        onClick={this.handleClick.bind(this)}
      >
        <span
          className="theme-background-picker__swatch"
          title="Theme Texture"
          style={{
            backgroundColor: accentcolor,
            backgroundImage: backgroundSwatch
          }}
        />
        <span className="theme-background-picker__text" title="Theme Texture">Theme Texture</span>
        <div className="theme-background-picker__backgrounds">
          <div className="theme-background-picker__backgrounds-inner">
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
      </div>
    );
  }
}

export default onClickOutside(ThemeBackgroundPicker);
