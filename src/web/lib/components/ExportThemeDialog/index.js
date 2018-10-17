import React from "react";
import Modal from "../Modal";

class ExportThemeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelIndex: 0
    };
  }

  handleNext() {
    let panel = this.state.panelIndex;
    panel++;
    this.setState({ panelIndex: panel });
  }

  handleClose() {
    this.setState({panelIndex: 0});
    this.props.clearExportedTheme();
  }

  renderContent() {
    const { panelIndex } = this.state;
    const { exportedTheme } = this.props;

    switch (panelIndex) {
      case 0:
        return (
          <>
            <h2>Export your theme</h2>
            <p>
              Create a compressed version of your theme that you can submit to
              the{" "}
              <a
                href="https://addons.mozilla.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox Add-ons Marketplace
              </a>
              .
            </p>
            <button className="modal__button" onClick={() => this.handleNext()}>
              Next
            </button>
          </>
        );
      case 1:
        return (
          <>
            <h2>Name your theme</h2>
            <form className="modal__form">
              <label>Give your theme a descriptive name.</label>
              <input type="text" maxLength="32" placeholder="Theme name" />
            </form>
            <button className="modal__button" onClick={() => this.handleNext()}>
              Next
            </button>
          </>
        );
      case 2:
        return (
          <>
            <h2>Ready to download!</h2>
            <p>
              Grab the XPI if you want to submit your theme to the{" "}
              <a
                href="https://addons.mozilla.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox Add-ons Marketplace
              </a>{" "}
              or grab the ZIP if you want to explore the code yourself.
            </p>
            <div className="modal__buttons">
              <a
                className="modal__button"
                download="theme.zip"
                href={exportedTheme}
              >
                theme.zip
              </a>{" "}
              <a
                className="modal__button"
                download="theme.xpi"
                href={exportedTheme}
              >
                theme.xpi
              </a>{" "}
            </div>
          </>
        );
      default:
        return null;
    }
  }

  render() {
    const { shouldOfferExportedTheme } = this.props;
    return (
      <Modal
        toggleModal={() => this.handleClose()}
        displayModal={shouldOfferExportedTheme}
      >
        {this.renderContent()}
      </Modal>
    );
  }
}

export default ExportThemeDialog;
