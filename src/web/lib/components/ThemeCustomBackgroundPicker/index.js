import React from "react";
import {
  CUSTOM_BACKGROUND_MAXIMUM_SIZE,
  CUSTOM_BACKGROUND_ALLOWED_TYPES
} from "../../../../lib/constants";

export default class ThemeCustomBackgroundPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customBackgroundTooLarge: false,
      customBackgroundWrongType: false
    };
    this.handleFileChoice = this.handleFileChoice.bind(this);
  }

  render() {
    const { themeHasCustomBackground, clearCustomBackground } = this.props;
    const { customBackgroundTooLarge, customBackgroundWrongType } = this.state;
    const { handleFileChoice } = this;

    return (
      <form className="custom-background" onSubmit={e => e.preventDefault()}>
        <label htmlFor="customBackground">
          <h2>Custom background image</h2>
        </label>
        {customBackgroundTooLarge && (
          <p className="error">
            Custom background too large, please choose another.
          </p>
        )}
        {customBackgroundWrongType && (
          <p className="error">
            Custom background not an allowed media type (JPEG or PNG)
          </p>
        )}
        <input type="file" id="customBackground" onChange={handleFileChoice} />
        {themeHasCustomBackground && (
          <input
            type="button"
            id="clearBackground"
            defaultValue="Clear Background"
            onClick={ev => {
              clearCustomBackground();
              ev.preventDefault();
            }}
          />
        )}
      </form>
    );
  }

  handleFileChoice(ev) {
    const { setCustomBackground } = this.props;

    const file = ev.target.files[0];

    if (file.size > CUSTOM_BACKGROUND_MAXIMUM_SIZE) {
      this.setState({ customBackgroundTooLarge: true });
      return;
    }

    if (!CUSTOM_BACKGROUND_ALLOWED_TYPES.includes(file.type)) {
      this.setState({ customBackgroundWrongType: true });
      return;
    }

    this.setState({
      customBackgroundTooLarge: false,
      customBackgroundWrongType: false
    });

    const reader = new FileReader();
    reader.onload = ev => {
      const url = ev.target.result;
      setCustomBackground({ url });
    };

    reader.readAsDataURL(file);
  }
}
