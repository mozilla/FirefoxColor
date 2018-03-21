import React from "react";
import "./index.scss";
import { loaderQuotes } from "../../../../lib/constants";

export const AppLoadingIndicator = () => {
  const i = Math.floor(Math.random() * loaderQuotes.length);
  return (
    <div className="app-loading-indicator">
      <div className="app-loading-indicator__spinner" />
      <q className="app-loading-indicator__quote">{loaderQuotes[i].quote}</q>
      <p className="app-loading-indicator__attribution">
        &#8211;{loaderQuotes[i].attribution}
      </p>
    </div>
  );
};

export default AppLoadingIndicator;
