import React from "react";
import "./index.scss";

export const ExportThemeDialog = ({
  isThemeExportInProgress,
  shouldOfferExportedTheme,
  exportedTheme,
  clearExportedTheme
}) => {
  const onClickBackdrop = ev => {
    if (ev.target && ev.target.className === "export-theme-dialog-wrapper") {
      clearExportedTheme();
    }
  };
  return (
    <div className="export-theme-dialog-wrapper" onClick={onClickBackdrop}>
      <div className="export-theme-dialog">
        <div className="options">
          <p>Your exported theme is ready!</p>
          <div>
            <div className="buttons">
              <a className="button" download="theme.zip" href={exportedTheme}>
                theme.zip
              </a>{" "}
              <a className="button" download="theme.xpi" href={exportedTheme}>
                theme.xpi
              </a>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportThemeDialog;
