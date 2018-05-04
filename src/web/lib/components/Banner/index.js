import React from "react";

import { DOWNLOAD_FIREFOX_URL } from "../../../../lib/constants";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

export const Banner = ({ isFirefox, addonUrl }) => (
  <div className="banner">
    {isFirefox ? (
      <div className="banner__content">
        <h2>Put Some 🔥 in Firefox</h2>
        <h3>Build beautiful themes for your browser with just a few clicks</h3>

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

        <h2 className="banner__header-small">Browse Beautiful</h2>
        <h3>Create custom Firefox themes<br /> with just a few clicks</h3>
        <a href={DOWNLOAD_FIREFOX_URL} className="banner__button">
            <div className="banner__logo" /> Download Firefox
        </a>
      </div>
    )}
  </div>
);

export default Banner;
