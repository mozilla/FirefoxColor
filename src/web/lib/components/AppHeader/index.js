import React from "react";
import ReactSVG from "react-svg";
import classnames from "classnames";

import {
  generateComplementaryTheme,
} from "../../../../lib/generators";

import { version } from "../../../../../package.json";
import { surveyUrl } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

import ThemeSaveButton from "../ThemeSaveButton";

import iconFeedback from "./feedback.svg";
import iconUndo from "./icon_undo.svg";
import iconRedo from "./icon_redo.svg";
import iconHeart from "./icon_heart.svg";
import iconRandomize from "./icon_randomize.svg";
import iconExport from "./icon_export.svg";
import iconShare from "./icon_share.svg";

import "./index.scss";

export const AppHeader = ({
  theme,
  hasExtension,
  undo,
  redo,
  themeCanUndo,
  themeCanRedo,
  userHasEdited,
  modifiedSinceSave,
  storage,
  savedThemes,
  setThemeBuilderPanel,
  setTheme,

}) => {
  const survey = `${surveyUrl}?ref=app&ver=${version}`;
  const highlightColor = colorToCSS(theme.colors.tab_line);
  const handleRandomClick = () => {
    setTheme({ theme: generateComplementaryTheme() });
  };
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
              style={{ color: highlightColor }}
            >
              Firefox Test Pilot
            </a>{" "}
            Experiment
          </h3>
        </header>
      </div>
      <div className="app-header__controls">
        <button
          title="Undo"
          className={classnames("undo app-header__button", {
            disabled: !themeCanUndo
          })}
          onClick={undo}
        >
          <div className="app-header__button-icon">
            <img src={iconUndo} />
          </div>
          <span>Undo</span>
        </button>
        <button
          title="Redo"
          className={classnames("redo app-header__button", {
            disabled: !themeCanRedo
          })}
          onClick={redo}
        >
          <div className="app-header__button-icon">
            <img src={iconRedo} />
          </div>
          <span>Redo</span>
        </button>
        <button title="Random" className="random app-header__button" onClick={handleRandomClick}>
          <div className="app-header__button-icon">
            <img src={iconRandomize} />
          </div>
          <span>Random</span>
        </button>
        <div className="app-header__spacer" />
        <ThemeSaveButton
          {...{
            name: "app-header__button",
            theme,
            savedThemes,
            generateThemeKey: storage.generateThemeKey,
            putTheme: storage.putTheme,
            userHasEdited,
            modifiedSinceSave,
            setThemeBuilderPanel
          }}
        >
          <div className="app-header__button-icon">
            <img src={iconHeart} />
          </div>
        </ThemeSaveButton>
        <button title="Share" className="share app-header__button">
          <div className="app-header__button-icon">
            <img src={iconShare} />
          </div>
          <span>Share</span>
        </button>
        <button title="Export" className="export app-header__button">
          <div className="app-header__button-icon">
            <img src={iconExport} />
          </div>
          <span>Export</span>
        </button>
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
            <ReactSVG svgStyle={{ fill: "#fff" }} path={iconFeedback} />
          </a>
        )}
      </div>
    </div>
  );
};

export default AppHeader;
