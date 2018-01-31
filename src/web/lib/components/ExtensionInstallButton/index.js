import React from 'react';

import './index.scss';

export const ExtensionInstallButton = ({ addonUrl }) =>
  <div className="extension-install-button banner">
    <span>Get TRF today</span>
    <a href={addonUrl} className="installButton">
      Install TRF
    </a>
  </div>;

export default ExtensionInstallButton;
