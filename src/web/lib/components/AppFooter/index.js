import React from "react";
import ReactSVG from "react-svg";

import Metrics from "../../../../lib/metrics";

import iconMoz from "./moz-logo.svg";
import iconGH from "./github-logo.svg";
import iconTwitter from "./twitter-logo.svg";

import "./index.scss";

export const AppFooter = ({ hasExtension, setDisplayLegalModal }) => {
  const toggleModal = name => {
    Metrics.linkClick(name);
    setDisplayLegalModal({ display: true });
  };
  return (
    <footer className="app-footer">
      <nav className="app-footer__legal">
        <a
          className="app-footer__legal-link"
          onClick={() => Metrics.linkClick("mozilla-logo")}
          href="https://www.mozilla.org"
          aria-label="Mozilla logo"
        >
          <ReactSVG path={iconMoz} className="app-footer__legal-logo" />
        </a>
        <a
          className="app-footer__legal-link"
          onClick={() => Metrics.linkClick("legal")}
          href="https://www.mozilla.org/about/legal"
        >
          Legal
        </a>
        <a
          className="app-footer__legal-link"
          onClick={() => Metrics.linkClick("about")}
          href="https://testpilot.firefox.com/about"
        >
          About Test Pilot
        </a>
        <span
          className="app-footer__legal-link"
          onClick={() => toggleModal("Privacy")}
        >
          Privacy
        </span>
        <span
          className="app-footer__legal-link"
          onClick={() => toggleModal("Terms")}
        >
          Terms
        </span>
        <a
          className="app-footer__legal-link"
          onClick={() => Metrics.linkClick("cookies")}
          href="https://www.mozilla.org/privacy/websites/#cookies"
        >
          Cookies
        </a>
        {hasExtension && (
          <a
            className="app-footer__legal-link"
            onClick={() => Metrics.linkClick("uninstall")}
            href="https://testpilot.firefox.com/experiments/color"
          >
            Uninstall
          </a>
        )}
      </nav>
      <nav className="app-footer__social">
        <a
          className="app-footer__social-link"
          onClick={() => Metrics.linkClick("twitter")}
          href="https://twitter.com/FxTestPilot"
          aria-label="@FxTestPilot Twitter"
          title="Twitter"
        >
          <ReactSVG path={iconTwitter} svgClassName="app-footer__social-logo" />
        </a>
        <a
          className="app-footer__social-link"
          onClick={() => Metrics.linkClick("github")}
          href="https://github.com/mozilla/FirefoxColor/"
          aria-label="Firefox Color GitHub"
          title="GitHub"
        >
          <ReactSVG path={iconGH} svgClassName="app-footer__social-logo" />
        </a>
      </nav>
    </footer>
  );
};

export default AppFooter;
