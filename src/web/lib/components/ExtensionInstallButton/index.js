import React from 'react';

import './index.scss';

export const ExtensionInstallButton = () =>
  <div className="extension-install-button">
    <a href="addon.xpi" className="installButton">
      Install the extension for fun with themes!
    </a>
  </div>;

export default ExtensionInstallButton;
