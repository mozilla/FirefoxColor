import React from "react";
import { makeLog } from "../../../../lib/utils";

const log = makeLog("ThemeCustomBackgroundPicker");

export const ThemeCustomBackgroundPicker = ({
  theme,
  setCustomBackground,
  clearCustomBackground
}) => (
  <form className="custom-background" onSubmit={e => e.preventDefault()}>
    <label htmlFor="customBackground">
      <h2>Custom background image</h2>
    </label>
    <input
      type="file"
      id="customBackground"
      onChange={ev => handleFileChoice(ev, setCustomBackground)}
    />
    <input
      type="button"
      id="clearBackground"
      value="Clear Background"
      onClick={ev => clearCustomBackground()}
    />
  </form>
);

const handleFileChoice = (ev, setCustomBackground) => {
  const file = ev.target.files[0];
  log(file);

  const reader = new FileReader();
  reader.onload = ev => {
    const url = ev.target.result;
    setCustomBackground({ url });
  };

  reader.readAsDataURL(file);
};

export default ThemeCustomBackgroundPicker;
