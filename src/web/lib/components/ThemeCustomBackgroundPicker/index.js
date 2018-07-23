import React from "react";
import {
  CUSTOM_BACKGROUND_MAXIMUM_SIZE,
  CUSTOM_BACKGROUND_ALLOWED_TYPES
} from "../../../../lib/constants";

export const ThemeCustomBackgroundPicker = props => (
  <form className="custom-background" onSubmit={e => e.preventDefault()}>
    <label htmlFor="customBackground">
      <h2>Custom background image</h2>
    </label>
    <ThemeCustomBackgroundSelector {...{ ...props, index: 0 }} />
    <ThemeCustomBackgroundSelector {...{ ...props, index: 1 }} />
    <ThemeCustomBackgroundSelector {...{ ...props, index: 2 }} />
  </form>
);

class ThemeCustomBackgroundSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customBackgroundTooLarge: false,
      customBackgroundWrongType: false
    };
  }

  render() {
    const {
      index,
      themeCustomBackgrounds,
      themeHasCustomBackgrounds
    } = this.props;
    const {
      handleClearBackground,
      handleFileChoice,
      handleAlignmentChange,
      handleTilingChange,
      handleMoveUp,
      handleMoveDown
    } = this;

    const { url, tiling, alignment } = themeCustomBackgrounds[index] || {};
    const { customBackgroundTooLarge, customBackgroundWrongType } = this.state;

    return (
      <div>
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

        <p>{url ? <img src={url} height="50" /> : "NONE"}</p>

        <input type="file" id="customBackground" onChange={handleFileChoice} />

        {themeHasCustomBackgrounds && (
          <div>
            <button onClick={handleMoveUp}>Up</button>
            <button onClick={handleMoveDown}>Down</button>
            <input
              type="button"
              id="clearBackground"
              defaultValue="Clear Background"
              onClick={handleClearBackground}
            />
            <select
              id="alignment"
              value={alignment}
              onChange={handleAlignmentChange}
            >
              <option value="">none</option>
              <option value="bottom">bottom</option>
              <option value="center">center</option>
              <option value="left">left</option>
              <option value="right">right</option>
              <option value="top">top</option>
              <option value="center bottom">center bottom</option>
              <option value="center center">center center</option>
              <option value="center top">center top</option>
              <option value="left bottom">left bottom</option>
              <option value="left center">left center</option>
              <option value="left top">left top</option>
              <option value="right bottom">right bottom</option>
              <option value="right center">right center</option>
              <option value="right top">right top</option>
            </select>
            <select id="tiling" value={tiling} onChange={handleTilingChange}>
              <option value="">none</option>
              <option value="no-repeat">no-repeat</option>
              <option value="repeat">repeat</option>
              <option value="repeat-x">repeat-x</option>
              <option value="repeat-y">repeat-y</option>
            </select>
          </div>
        )}
      </div>
    );
  }

  handleClearBackground = (ev) => {
    const { index, clearCustomBackground } = this.props;
    clearCustomBackground({ index });
    ev.preventDefault();
  }

  handleMove = (newIndex) => {
    const { index: oldIndex, moveCustomBackground, themeCustomBackgrounds } = this.props;
    if (newIndex < 0) { return; }
    if (newIndex > themeCustomBackgrounds.length) { return; }
    moveCustomBackground({ oldIndex, newIndex });
  }

  handleMoveUp = () => this.handleMove(this.props.index - 1)

  handleMoveDown = () => this.handleMove(this.props.index + 1)

  handleAlignmentChange = (ev) => {
    const { index, themeCustomBackgrounds, setCustomBackground } = this.props;
    const { url, tiling } = themeCustomBackgrounds[index] || {};
    const alignment = ev.target.value;
    setCustomBackground({ index, url, tiling, alignment });
  }

  handleTilingChange = (ev) => {
    const { index, themeCustomBackgrounds, setCustomBackground } = this.props;
    const { url, alignment } = themeCustomBackgrounds[index] || {};
    const tiling = ev.target.value;
    setCustomBackground({ index, url, tiling, alignment });
  }

  handleFileChoice = (ev) => {
    const { index, themeCustomBackgrounds, setCustomBackground } = this.props;
    const { tiling, alignment } = themeCustomBackgrounds[index] || {};

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
      setCustomBackground({ index, url, tiling, alignment });
    };

    reader.readAsDataURL(file);
  }
}

export default ThemeCustomBackgroundPicker;
