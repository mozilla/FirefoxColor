import React from "react";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

import { colorToCSS, bgImages } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";
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
  }

  handleClick() {
    this.setState({ selected: !this.state.selected });
  }

  handleClickOutside() {
    this.setState({ selected: false });
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
        title="Theme Texture"
      >
        <span
          className="theme-background-picker__swatch"
          style={{
            backgroundColor: accentcolor,
            backgroundImage: backgroundSwatch
          }}
        />
        <span className="theme-background-picker__text">Theme Texture</span>
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
