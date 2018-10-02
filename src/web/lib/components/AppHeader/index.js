import React from "react";
import classnames from "classnames";

import {
  generateComplementaryTheme,
  generateRandomTheme
} from "../../../../lib/generators";

import { version } from "../../../../../package.json";
import { surveyUrl } from "../../../../lib/constants";
import Metrics from "../../../../lib/metrics";

import ThemeSaveButton from "../ThemeSaveButton";
import ThemeUrl from "../ThemeUrl";

import iconUndo from "./icon_undo.svg";
import iconRedo from "./icon_redo.svg";
import iconHeart from "./icon_heart.svg";
import iconRandomize from "./icon_randomize.svg";
import iconShare from "./icon_share.svg";
import iconFeedback from "./feedback.svg";

import "./index.scss";

export const AppHeader = props => {
  const {
    hasExtension,
    undo,
    redo,
    themeCanUndo,
    themeCanRedo,
    setTheme,
    displayShareModal,
    setDisplayShareModal
  } = props;
  const survey = `${surveyUrl}?ref=app&ver=${version}`;
  const handleRandomClick = () => {
    Math.random() >= 0.5
      ? setTheme({ theme: generateComplementaryTheme() })
      : setTheme({ theme: generateRandomTheme() });
  };

  const onShareClick = () => {
    setDisplayShareModal({ display: !displayShareModal });
  };

  const headerButton = (
    onClickButton,
    icon,
    text,
    disabledCheck = true,
    children = null
  ) => (
    <React.Fragment>
      <button
        title={text}
        className={classnames("app-header__button", `${text}`, {
          disabled: !disabledCheck
        })}
        onClick={onClickButton}
      >
        <div className="app-header__button-icon">
          <img src={icon} width="20" height="auto" aria-hidden="true"/>
        </div>
        <span>{text}</span>
      </button>
      {children}
    </React.Fragment>
  );

  return (
    <div className="app-header">
      <div className="app-header__content">
        <div className="app-header__icon" />
        <header>
          <h1>Firefox Color</h1>
          <h3>
            A{" "}
            <a
              href="https://testpilot.firefox.com"
              onClick={() => Metrics.linkClick("test-pilot")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Firefox Test Pilot
            </a>{" "}
            Experiment
          </h3>
        </header>
      </div>
      <div className="app-header__controls">
        {headerButton(undo, iconUndo, "Undo", themeCanUndo)}
        {headerButton(redo, iconRedo, "Redo", themeCanRedo)}
        {headerButton(handleRandomClick, iconRandomize, "Random")}

        <div className="app-header__spacer" />

        <ThemeSaveButton name="app-header__button" {...props}>
          <div className="app-header__button-icon">
            <img src={iconHeart} width="20" height="auto" aria-hidden="true"/>
          </div>
        </ThemeSaveButton>

        {headerButton(
          onShareClick,
          iconShare,
          "Share",
          true,
          <React.Fragment>
            {displayShareModal && <ThemeUrl {...props} />}
          </React.Fragment>
        )}

        {/* TODO: add export capability
          headerButton(() => {}, iconExport, "Export") */}

        {hasExtension && (
          <a
            href={survey}
            onClick={() => Metrics.linkClick("survey")}
            title="Feedback"
            className="app-header__survey"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Feedback</span>
            <img src={iconFeedback} aria-hidden="true" />
          </a>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
