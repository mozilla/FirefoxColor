import React from 'react';
import Metrics from '../../../../lib/metrics';
import BrowserPreview from '../BrowserPreview';
import './index.scss';

export const SharedThemeDialog = ({ pendingTheme, setTheme, clearPendingTheme }) => {
  const onApply = () => {
    Metrics.receiveTheme('apply', pendingTheme);
    setTheme({ theme: pendingTheme });
    clearPendingTheme();
  };
  const onSkip = () => {
    Metrics.receiveTheme('reject', pendingTheme);
    clearPendingTheme();
  };
  const onClickBackdrop = ev => {
    if (ev.target && ev.target.className === 'shared-theme-dialog-wrapper') {
      onSkip();
    }
  };
  return (
    <div className="shared-theme-dialog-wrapper" onClick={onClickBackdrop}>
      <div className="shared-theme-dialog">
        <div className="preview">
          <BrowserPreview {...{ size: 'medium', theme: pendingTheme }} />
        </div>
        <div className="options">
          <p>Do you want to apply this custom theme?</p>
          <div className="buttons">
            <button className="apply" onClick={onApply}>Apply</button>
            <button className="skip" onClick={onSkip}>Skip</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedThemeDialog;
