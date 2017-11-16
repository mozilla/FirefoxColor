import React from 'react';

import './index.scss';

export const ExtensionInstallButton = ({ addonUrl }) =>
  <div className="extension-install-button">
    <a href={addonUrl} className="installButton">
      Install the extension for fun with themes!
    </a>
  </div>;

export default ExtensionInstallButton;
