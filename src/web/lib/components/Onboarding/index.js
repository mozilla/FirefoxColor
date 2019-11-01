import React from "react";

import classnames from "classnames";

import "./index.scss";
import LogoIcon from "./LogoIcon";
import SparklesIcon from "./SparklesIcon";

const PANEL_COLORS = ["#0a84ff", "#b5007f", "#8000d7", "#d76e00", "#0a84ff"];

const PANEL_STRINGS = [
  "Welcome to Firefox Color!",
  "Use the markers to build new themes.",
  "Every theme you create has a sharable URL.",
  "Or just save your creations for yourself.",
  "Let's get started!"
];
const PANEL_SPRITE_OFFSET = -280;

export default class Onboarding extends React.Component {
  constructor() {
    super();
    this.state = {
      index: 0,
      isDisplayed: true
    };
  }

  handleDismiss = e => {
    if (e.target.classList.contains("dismissable")) {
      this.setState({ isDisplayed: false });
    }
  };

  handleAdvance = () => {
    let newIndex = this.state.index;
    this.setState({ index: ++newIndex });
  };

  renderButton(index) {
    if (index < PANEL_COLORS.length - 1) {
      return (
        <button onClick={this.handleAdvance} title="Next">
          Next
        </button>
      );
    }
    return (
      <button className="dismissable" onClick={this.handleDismiss} title="Done">
        Ok
      </button>
    );
  }

  render() {
    const { index, isDisplayed } = this.state;
    const lastSlide = PANEL_STRINGS.length - 1 === index;

    const backgroundXStyles = !lastSlide ? {
      backgroundPositionX: index * PANEL_SPRITE_OFFSET
    } : {};

    return (
      <div
        className={classnames("onboarding", {
          "onboarding--display": isDisplayed
        })}
      >
        <div
          className="onboarding__panels"
          style={{ background: PANEL_COLORS[index] }}
        >
          <div className="onboarding__content">
            <div
              className={classnames("onboarding__icon", { "onboarding__icon--close": lastSlide })}
              style={backgroundXStyles}
            />
            {lastSlide &&
              <div className="stuff">
                <SparklesIcon />
                <LogoIcon width="100" height="100" />
                <SparklesIcon />
              </div>
            }
            {PANEL_STRINGS[index]}
          </div>
          <span>{this.renderButton(index)}</span>
        </div>
      </div>
    );
  }
}