import React from "react";

import "./index.scss";

const ThemeLogger = ({ theme }) => (
  <div className="theme-logger">
    <pre>{JSON.stringify(theme, null, 2)}</pre>
  </div>
);

export default ThemeLogger;
