import React from "react";
import classnames from "classnames";

import "./index.scss";

import { colorToCSS } from "../../../../lib/themes";
import { bgImages } from "../../../../lib/assets";
import Metrics from "../../../../lib/metrics";

const Pattern = ({ src, backgroundId, active, setBackground, accentcolor }) => (
  <div
    className={classnames("theme-pattern-picker__pattern", { active })}
    onClick={() => {
      setBackground({ url: src });
      Metrics.themeChangeBackground(backgroundId);
    }}
  >
    <div
      className="theme-pattern-picker__color"
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

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  render() {
    const { theme, setBackground } = this.props;
    const accentcolor = colorToCSS(theme.colors.accentcolor);
    return (
      <div className="theme-pattern-picker">
        <p>Pick a pattern for your theme...</p>
        <div className="theme-pattern-picker__inner">
          {bgImages.keys().map((src, backgroundId) => (
            <Pattern
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
    );
  }
}

export default ThemeBackgroundPicker;
