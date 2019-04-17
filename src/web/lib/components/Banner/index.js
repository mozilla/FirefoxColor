import React, { Fragment } from "react";
import classnames from "classnames";

import { DOWNLOAD_FIREFOX_URL } from "../../../../lib/constants";

import "./index.scss";

export const Banner = ({ isFirefox, addonUrl }) => {
  return (
    <div className={classnames("banner", { "banner--ff-ad": !isFirefox })}>
      <div className="banner__content">
        {isFirefox && (
          <Fragment>
            <h2>Build Beautiful Firefox Themes</h2>
            <a
              href={addonUrl}
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
      </div>
    </div>
  );
};

export default Banner;
