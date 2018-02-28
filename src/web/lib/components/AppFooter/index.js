import React from 'react';
import ReactSVG from 'react-svg';

import Metrics from '../../../../lib/metrics';

import iconMoz from './moz-logo.svg';
import iconGH from './github-logo.svg';
import iconTwitter from './twitter-logo.svg';

import './index.scss';

export const AppFooter = () => (
  <footer className="app-footer">
    <div className="app-footer__legal">
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick('mozilla-logo')}
        href="https://www.mozilla.org"
      >
        <ReactSVG path={iconMoz} className="app-footer__legal-logo" />
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick('legal')}
        href="https://www.mozilla.org/about/legal"
      >
        Legal
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick('about')}
        href="https://testpilot.firefox.com/about"
      >
        About Test Pilot
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick('privacy')}
        href="/legal"
      >
        Privacy
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick('terms')}
        href="/legal"
      >
        Terms
      </a>
      <a
        className="app-footer__legal-link"
        onClick={() => Metrics.linkClick('cookies')}
        href="https://www.mozilla.org/privacy/websites/#cookies"
      >
        Cookies
      </a>
    </div>
    <div className="app-footer__social">
      <a
        className="app-footer__social-link"
        onClick={() => Metrics.linkClick('twitter')}
        href="https://twitter.com/FxTestPilot"
      >
        <ReactSVG path={iconTwitter} className="app-footer__social-logo" />
      </a>
      <a
        className="app-footer__social-link"
        onClick={() => Metrics.linkClick('github')}
        href="https://github.com/mozilla/ThemesRFun/"
      >
        <ReactSVG path={iconGH} className="app-footer__social-logo" />
      </a>
    </div>
  </footer>
);

export default AppFooter;
