import React from "react";
import "./index.scss";

export const ExportThemeDialog = ({
  isThemeExportInProgress,
  shouldOfferExportedTheme,
  exportedTheme,
  clearExportedTheme
}) => (
  <div>
    {isThemeExportInProgress && <div>THEME EXPORT IN PROGRESS</div>}
    {shouldOfferExportedTheme && (
      <div>
        Exported theme:{" "}
        <a download="theme.zip" href={exportedTheme}>
          theme.zip
        </a>{" "}
        <a download="theme.xpi" href={exportedTheme}>
          theme.xpi
        </a>{" "}
        <button onClick={clearExportedTheme}>Clear</button>
      </div>
    )}
  </div>
);

export default ExportThemeDialog;
