import React from "react";
import ReactSVG from "react-svg";

import Metrics from "../../../../lib/metrics";

import iconMoz from "./moz-logo.svg";
import iconGH from "./github-logo.svg";
import iconTwitter from "./twitter-logo.svg";

import "./index.scss";

export const AppFooter = () => (
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
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick("privacy")}
        href="/legal"
      >
        Privacy
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick("terms")}
        href="/legal"
      >
        Terms
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick("cookies")}
        href="https://www.mozilla.org/privacy/websites/#cookies"
      >
        Cookies
      </a>
    </nav>
    <nav className="app-footer__social">
      <a
        className="app-footer__social-link"
        onClick={() => Metrics.linkClick("twitter")}
        href="https://twitter.com/FxTestPilot"
        aria-label="@FxTestPilot Twitter"
        title="Twitter"
      >
        <ReactSVG path={iconTwitter} className="app-footer__social-logo" />
      </a>
      <a
        className="app-footer__social-link"
        onClick={() => Metrics.linkClick("github")}
        href="https://github.com/mozilla/Themer/"
        aria-label="Themer GitHub"
        title="GitHub"
      >
        <ReactSVG path={iconGH} className="app-footer__social-logo" />
      </a>
    </nav>
  </footer>
);

export default AppFooter;
