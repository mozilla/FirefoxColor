import React from "react";
import ReactSVG from "react-svg";

import { surveyUrl } from "../../../../lib/constants";
import Metrics from "../../../../lib/metrics";

import iconFeedback from "./feedback.svg";
import "./index.scss";

export const AppHeader = ({ hasExtension, appVersion = null }) => {
  let survey = `${surveyUrl}?ref=app`;
  if (appVersion) {
    survey += `${survey}&ver=${appVersion}`;
  }
  return (
    <div className="app-header">
      <div className="app-header__content">
        <div className="app-header__icon" />
        <header>
          <h1>Firefox Themer</h1>
          <h3>
            A
            {" "}
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
          <ReactSVG style={{ fill: "#fff" }} path={iconFeedback} />
        </a>
      )}
    </div>
  );
};

export default AppHeader;
