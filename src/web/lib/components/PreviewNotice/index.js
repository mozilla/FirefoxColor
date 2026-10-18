import React from "react";

import { NOVA_BLOG_POST_URL } from "../../../../lib/constants";

import "./index.scss";

export const PreviewNotice = () => (
  <div className="preview-notice" role="note">
    <p className="preview-notice__text">
      Firefox has a new look called Nova. Firefox Color still shows the previous
      design, so your theme may look slightly different in Firefox.{" "}
      <a
        className="preview-notice__link"
        href={NOVA_BLOG_POST_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn more about Nova and the new changes
      </a>
    </p>
  </div>
);

export default PreviewNotice;
