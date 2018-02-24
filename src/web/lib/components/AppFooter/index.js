import React from 'react';
import ReactSVG from 'react-svg';
import iconMoz from './moz-logo.svg';
import iconGH from './github-logo.svg';
import iconTwitter from './twitter-logo.svg';

import './index.scss';

export const AppFooter = () =>
  <footer className="app-footer">
    <nav className="app-footer__legal">
      <a className="app-footer__legal-link" href="https://www.mozilla.org" aria-label="Mozilla logo">
        <ReactSVG path={ iconMoz } className="app-footer__legal-logo"/>
      </a>
      <a className="app-footer__legal-link" href="https://www.mozilla.org/about/legal">
        Legal
      </a>
      <a className="app-footer__legal-link" href="https://testpilot.firefox.com/about">
        About Test Pilot
      </a>
      <a className="app-footer__legal-link" href="/legal">
        Privacy
      </a>
      <a className="app-footer__legal-link" href="/legal">
        Terms
      </a>
      <a className="app-footer__legal-link" href="https://www.mozilla.org/privacy/websites/#cookies">
        Cookies
      </a>
    </nav>
    <nav className="app-footer__social">
      <a className="app-footer__social-link" href="https://twitter.com/FxTestPilot" aria-label="@FxTestPilot Twitter">
        <ReactSVG path={ iconTwitter } className="app-footer__social-logo"/>
      </a>
      <a className="app-footer__social-link" href="https://github.com/mozilla/ThemesRFun/" aria-label="Themer GitHub">
        <ReactSVG path={ iconGH } className="app-footer__social-logo"/>
      </a>
    </nav>
  </footer>;

export default AppFooter;
