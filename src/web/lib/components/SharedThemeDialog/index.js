import React from "react";
import Browser from "../Browser";
import "./index.scss";

export const SharedThemeDialog = ({
  pendingTheme,
  setTheme,
  clearPendingTheme,
  previewTheme
}) => {
  const onApply = () => {
    setTheme({ theme: pendingTheme });
    clearPendingTheme();
  };
  const onSkip = () => {
    clearPendingTheme();
  };
  const onClickBackdrop = ev => {
    if (ev.target && ev.target.className === "shared-theme-dialog-wrapper") {
      onSkip();
    }
  };
  const onHover = mouseEnter => {
    if (mouseEnter) {
      previewTheme({ theme: pendingTheme });
    } else {
      previewTheme({});
    }
  };
  return (
    <div className="shared-theme-dialog-wrapper" onClick={onClickBackdrop}>
      <div className="shared-theme-dialog">
        <div className="preview" onMouseEnter={() => onHover(true)} onMouseLeave={() => onHover(false)}>
          <Browser {...{ size: "medium", theme: pendingTheme }} />
        </div>
        <div className="options">
          <p>Do you want to apply this custom theme?</p>
          <div className="buttons">
            <button className="skip" onClick={onSkip}>
              Nope
            </button>
            <button className="apply" onClick={onApply}>
              Yep
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedThemeDialog;
