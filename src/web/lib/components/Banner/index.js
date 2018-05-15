import React, { Fragment } from "react";
import classnames from "classnames";

import { DOWNLOAD_FIREFOX_URL } from "../../../../lib/constants";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

export const Banner = ({ isFirefox, addonUrl, setSelectedColor }) => {
  const handleClick = () => {
    setSelectedColor({ name: "accentcolor" });
  };

  return (
    <div className={classnames("banner", { "banner--ff-ad": !isFirefox })}>
      <div className="banner__content">
        <div className="banner__logo" />
        {isFirefox && (
          <Fragment>
            <h2>Build Beautiful Firefox Themes</h2>
            <a
              href={addonUrl}
              onClick={() => Metrics.installStart()}
              className="banner__button"
            >
              Install Firefox Color
            </a>
          </Fragment>
        )}
        {!isFirefox && (
          <Fragment>
            <h2>Browse in Style</h2>
            <h3>Create unique Firefox themes with just a few clicks</h3>
            <a href={DOWNLOAD_FIREFOX_URL} className="banner__button">
              Download Firefox
            </a>
          </Fragment>
        )}
        <p>
          ...or click any marker above (<span
            className="banner__marker"
            onClick={handleClick}
          />) to see how it works.
        </p>
      </div>
    </div>
  );
};

export default Banner;
