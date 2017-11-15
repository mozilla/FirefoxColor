import React from 'react';

import './index.scss';

export default class ExtensionInstallButton extends React.Component {
  render() {
    return <div className="extension-install-button">
      <a href="addon.xpi" className="installButton">Install the extension for fun with themes!</a>
    </div>;
  }
}
