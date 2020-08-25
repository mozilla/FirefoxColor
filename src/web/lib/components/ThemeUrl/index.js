import React from "react";
import classnames from "classnames";
import onClickOutside from "react-onclickoutside";

import { themesEqual } from "../../../../lib/themes";

import "./index.scss";

class ThemeUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      themeUrl: "",
      copied: false
    };
    this.handleCopied = () => {
      this.setState({ copied: true });
    };
  }

  componentDidMount() {
    this.updateThemeUrl(this.props.theme);
    this.props.clipboard.on("success", this.handleCopied);
  }

  componentWillUnmount() {
    this.props.clipboard.off("success", this.handleCopied);
  }

  componentDidUpdate(prev) {
    const { theme } = this.props;
    if (!themesEqual(prev.theme, theme)) {
      this.updateThemeUrl(theme);
    }
  }

  handleClickOutside(evt) {
    if (evt.target.classList.contains("Share")) return;
    this.props.setDisplayShareModal({ display: false });
  }

  handleCopied() {
    this.setState({ copied: true });
  }

  updateThemeUrl(theme) {
    if (!theme) {
      return;
    }

    const { urlEncodeTheme } = this.props;
    urlEncodeTheme({ theme }).then(themeUrl => {
      this.setState({ themeUrl, copied: false });
    });
  }

  render() {
    const { copied, themeUrl } = this.state;
    const { themeHasCustomBackgrounds, hasExtension } = this.props;

    if (themeHasCustomBackgrounds) {
      return (
        <div
          className={classnames("theme-url theme-url-disabled", {
            extension: hasExtension
          })}
        >
          <p>
            This theme cannot be shared via URL because it has a custom
            background image.
          </p>
        </div>
      );
    }

    return (
      <form
        className={classnames("theme-url", { extension: hasExtension })}
        onSubmit={e => e.preventDefault()}
      >
        <label htmlFor="themeUrl">
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

export default onClickOutside(ThemeUrl);
