import React from "react";

import "./index.scss";

import { colorToCSS } from "../../../../lib/themes";
import { bgImages } from "../../../../lib/assets";

console.log(bgImages);

const Pattern = ({ src, backgroundId, active, setBackground, frame }) => (
  <div>
    <input
      id={`theme-pattern-${backgroundId}`}
      aria-label={`Pattern ${backgroundId}`}
      checked={active}
      onChange={e => {
        if (e.target.checked) {
          setBackground({ url: src });
        }
      }}
      type="radio"
    />
    <div className="theme-pattern-picker__pattern">
      <label
        htmlFor={`theme-pattern-${backgroundId}`}
        className="theme-pattern-picker__color"
        style={{
          backgroundColor: frame,
          backgroundImage: `url(${bgImages(src)})`
        }}
      />
    </div>
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
    const frame = colorToCSS(theme.colors.frame);
    return (
      <div className="theme-pattern-picker">
        <p>Pick a pattern for your theme...</p>
        <div role="radiogroup" className="theme-pattern-picker__inner">
          {bgImages.keys().map((src, backgroundId) => (
            <Pattern
              key={backgroundId}
              {...{
                src,
                backgroundId,
                frame,
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
