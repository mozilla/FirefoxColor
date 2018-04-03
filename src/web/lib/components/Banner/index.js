import React from "react";
import classNames from "classnames";

import { DOWNLOAD_FIREFOX_URL } from "../../../../lib/constants";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

export const Banner = ({ isFirefox, addonUrl, bottom = false }) => (
  <div className={classNames("banner", { banner__bottom: bottom })}>
    {isFirefox ? (
      <div className="banner__content">
        <span>Put the 🔥 in Firefox</span>
        <a
          href={addonUrl}
          onClick={() => Metrics.installStart()}
          className="banner__button"
        >
          Install Firefox Color
        </a>
      </div>
    ) : (
      <div className="banner__content">
        <span>Get Firefox to enjoy customizing your theme!</span>
        <a href={DOWNLOAD_FIREFOX_URL} className="banner__button">
          Download Firefox
        </a>
      </div>
    )}
    {!bottom && <div className="banner__spacer" />}
  </div>
);

export default Banner;
