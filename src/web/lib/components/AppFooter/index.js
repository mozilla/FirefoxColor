import React from 'react';
import ReactSVG from 'react-svg';
import iconMoz from './moz-logo.svg';
import iconGH from './github-logo.svg';
import iconTwitter from './twitter-logo.svg';

import './index.scss';

export const AppFooter = () =>
  <footer className="app-footer">
    <div className="app-footer__legal">
      <a className="app-footer__legal-link" href="https://www.mozilla.org">
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
    </div>
    <div className="app-footer__social">
      <a className="app-footer__social-link" href="https://twitter.com/FxTestPilot">
        <ReactSVG path={ iconTwitter } className="app-footer__social-logo"/>
      </a>
      <a className="app-footer__social-link" href="https://github.com/mozilla/ThemesRFun/">
        <ReactSVG path={ iconGH } className="app-footer__social-logo"/>
      </a>
    </div>
  </footer>;

export default AppFooter;
