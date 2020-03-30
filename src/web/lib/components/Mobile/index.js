import React from "react";


import "./index.scss";

export const Mobile = () => (
  <div className="mobile">
    <div className="mobile__content">
      <div className="mobile__logo" />
      <h1>Firefox Color</h1>
      <p>
        Firefox Color is an experimental add-on that lets you build
        heartbreakingly beautiful themes for Firefox.
      </p>
      <p>
        Sadly, it&rsquo;s only available for Firefox on Mac, Windows and Linux.
      </p>
      <a
        href="https://testpilot.firefox.com/experiments/color"
      >
        Learn More
      </a>
    </div>
  </div>
);

export default Mobile;
