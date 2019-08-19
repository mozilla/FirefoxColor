import React from "react";
import ReactSVG from "react-svg";

import iconMoz from "./moz-logo.svg";
import iconGH from "./github-logo.svg";
import iconTwitter from "./twitter-logo.svg";

import "./index.scss";

export const AppFooter = ({ hasExtension, setDisplayLegalModal }) => {
  const toggleModal = name => {
    setDisplayLegalModal({ display: true });
  };
  return (
    <footer className="app-footer">
      <nav className="app-footer__legal">
        <a
          className="app-footer__legal-link"
          href="https://www.mozilla.org"
          aria-label="Mozilla logo"
        >
          <ReactSVG src={iconMoz} className="app-footer__legal-logo" />
        </a>
        <a
          className="app-footer__legal-link"
          href="https://www.mozilla.org/about/legal"
        >
          Legal
        </a>
        <a
          className="app-footer__legal-link"
          href="#"
          onClick={() => toggleModal("Privacy")}
        >
          Privacy
        </a>
        <a
          className="app-footer__legal-link"
          href="#"
          onClick={() => toggleModal("Terms")}
        >
          Terms
        </a>
        <a
          className="app-footer__legal-link"
          href="https://www.mozilla.org/privacy/websites/#cookies"
        >
          Cookies
        </a>
        {hasExtension && (
          <a
            className="app-footer__legal-link"
            href="https://support.mozilla.org/kb/disable-or-remove-add-ons"
          >
            Uninstall
          </a>
        )}
      </nav>
      <nav className="app-footer__social">
        <a
          className="app-footer__social-link"
          href="https://twitter.com/mozamo"
          aria-label="@firefox Twitter"
          title="Twitter"
        >
          <ReactSVG src={iconTwitter} svgClassName="app-footer__social-logo" />
        </a>
        <a
          className="app-footer__social-link"
          href="https://github.com/mozilla/FirefoxColor/"
          aria-label="Firefox Color GitHub"
          title="GitHub"
        >
          <ReactSVG src={iconGH} svgClassName="app-footer__social-logo" />
        </a>
      </nav>
    </footer>
  );
};

export default AppFooter;
