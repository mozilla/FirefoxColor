import React from "react";
import ReactSVG from "react-svg";

import { version } from "../../../../../package.json";
import { surveyUrl } from "../../../../lib/constants";
import { colorToCSS } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

import iconFeedback from "./feedback.svg";
import "./index.scss";

export const AppHeader = ({ theme, hasExtension }) => {
  const survey = `${surveyUrl}?ref=app&ver=${version}`;
  const highlightColor = colorToCSS(theme.colors.tab_line);
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
  );
};

export default AppHeader;
