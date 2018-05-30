import React from "react";

import classnames from "classnames";

import "./index.scss";

const PANEL_COLORS = [
  "#0a84ff",
  "#b5007f",
  "#8000d7",
  "#d76e00",
  "#0a84ff"];

const PANEL_STRINGS = [
  "Welcome to Firefox Color!",
  "Use the markers to build new themes.",
  "Every theme you create has a sharable URL.",
  "Or just save your creations for yourself.",
  "And don't forget to give us feedback!"
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

  handleDismiss(e) {
    if (e.target.classList.contains("dismissable")) {
      this.setState({ isDisplayed: false });
    }
  }

  handleAdvance() {
    let newIndex = this.state.index;
    this.setState({ index: ++newIndex });
  }

  renderButton(index) {
    if (index < PANEL_COLORS.length - 1) {
      return <button onClick={this.handleAdvance.bind(this)} title="Next">Next</button>;
    }
    return (
      <button className="dismissable" onClick={this.handleDismiss.bind(this)} title="Done">
        All set
      </button>
    );
  }

  render() {
    const { index, isDisplayed } = this.state;
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
              className="onboarding__icon"
              style={{backgroundPositionX: index * PANEL_SPRITE_OFFSET }}/>
            {PANEL_STRINGS[index]}
          </div>
          <span>{this.renderButton(index)}</span>
        </div>
      </div>
    );
  }
}
