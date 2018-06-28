import React from "react";
import Metrics from "../../../../lib/metrics";

import "./index.scss";

export default class ThemeUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeUrl: "",
      copied: false
    };
    this.handleCopied = () => {
      this.setState({ copied: true });
      Metrics.shareClick();
    };
  }

  componentDidMount() {
    this.updateThemeUrl(this.props.theme);
    this.props.clipboard.on("success", this.handleCopied);
  }

  componentWillUnmount() {
    this.props.clipboard.off("success", this.handleCopied);
  }

  componentWillReceiveProps({ theme }) {
    this.updateThemeUrl(theme);
  }

  handleCopied() {
    this.setState({ copied: true });
  }

  updateThemeUrl(theme) {
    if (!theme) {
      return;
    }

    const { urlEncodeTheme } = this.props;
    urlEncodeTheme(theme).then(themeUrl => {
      this.setState({ themeUrl, copied: false });
    });
  }

  render() {
    const { copied, themeUrl } = this.state;
    const { themeHasCustomBackground } = this.props;

    if (themeHasCustomBackground) {
      return (
        <div className="theme-url theme-url-disabled">
          <h2>Share your theme</h2>
          <p>This theme cannot be shared via URL because it has a custom background image.</p>
        </div>
      );
    }

    return (
      <form className="theme-url" onSubmit={e => e.preventDefault()}>
        <label htmlFor="themeUrl">
          <h2>Share your theme</h2>
          <p>Copy and paste this URL to share your creation.</p>
        </label>
        <input type="text" id="themeUrl" readOnly={true} value={themeUrl} />
        <input
          type="submit"
          className="clipboardButton"
          data-clipboard-target="#themeUrl"
          value={copied ? "Copied!" : "Copy"}
          title={copied ? "Copied!" : "Copy"}
        />
      </form>
    );
  }
}
