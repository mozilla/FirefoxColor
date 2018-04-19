import React from "react";
import "./index.scss";

export const AppLoadingIndicator = ({ loaderQuote }) => {
  return (
    <div className="app-loading-indicator">
      <div className="app-loading-indicator__spinner" />
      <q className="app-loading-indicator__quote">{loaderQuote.quote}</q>
      <p className="app-loading-indicator__attribution">
        &#8211;{loaderQuote.attribution}
      </p>
    </div>
  );
};

export default AppLoadingIndicator;
