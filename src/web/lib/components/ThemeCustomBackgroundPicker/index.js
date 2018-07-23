import React from "react";
import {SortableContainer, SortableElement} from "react-sortable-hoc";
import {
  CUSTOM_BACKGROUND_MAXIMUM_SIZE,
  CUSTOM_BACKGROUND_ALLOWED_TYPES
} from "../../../../lib/constants";

import "./index.scss";

class ThemeCustomBackgroundSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customBackgroundTooLarge: false,
      customBackgroundWrongType: false
    };
  }

  render() {
    const { item } = this.props;
    const {
      handleClearBackground,
      handleFileChoice,
      handleAlignmentChange,
      handleTilingChange
    } = this;

    const { url, tiling, alignment } = item;
    const { customBackgroundTooLarge, customBackgroundWrongType } = this.state;

    return (
      <li>
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

        <div>
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
      </li>
    );
  }

  handleClearBackground = (ev) => {
    const { clearCustomBackground } = this.props;
    clearCustomBackground();
    ev.preventDefault();
  }

  handleAlignmentChange = (ev) => {
    const { item, setCustomBackground } = this.props;
    const { url, tiling } = item;
    const alignment = ev.target.value;
    setCustomBackground({ url, tiling, alignment });
  }

  handleTilingChange = (ev) => {
    const { item, setCustomBackground } = this.props;
    const { url, alignment } = item;
    const tiling = ev.target.value;
    setCustomBackground({ url, tiling, alignment });
  }

  handleFileChoice = (ev) => {
    const { item, setCustomBackground } = this.props;
    const { tiling, alignment } = item;

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
      setCustomBackground({ url, tiling, alignment });
    };

    reader.readAsDataURL(file);
  }
}

const SortableThemeCustomBackgroundSelector = SortableElement(ThemeCustomBackgroundSelector);

const BackgroundList = SortableContainer(props => {
  const {
    clearCustomBackground,
    setCustomBackground
  } = props;
  return (
    <ul>
      {props.themeCustomBackgrounds.map((item, index) => (
        <SortableThemeCustomBackgroundSelector key={index} {...{
          item,
          index,
          clearCustomBackground: (args = {}) => clearCustomBackground({ index, ...args }),
          setCustomBackground: (args = {}) => setCustomBackground({ index, ...args })
        }} />
      ))}
    </ul>
  );
});

export class ThemeCustomBackgroundPicker extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAdd = () => {
    const { themeCustomBackgrounds, setCustomBackground } = this.props;
    const index = themeCustomBackgrounds.length;
    setCustomBackground({ index, url: "", tiling: "", alignment: "" });
  }

  handleMove = ({ oldIndex, newIndex }) => {
    const { moveCustomBackground } = this.props;
    moveCustomBackground({ oldIndex, newIndex });
  }

  render() {
    return (
      <form className="custom-background" onSubmit={e => e.preventDefault()}>
        <label htmlFor="customBackground">
          <h2>Custom background image</h2>
        </label>
        <button onClick={this.handleAdd}>Add</button>
        <BackgroundList {...this.props} helperClass="dragHelper" onSortEnd={this.handleMove} />
      </form>
    );
  }
}

export default ThemeCustomBackgroundPicker;
