import React from "react";

const StaticThemePicker = props => {

  const { staticThemesList, setTheme } = props;
  const handleClick = addonId => () => setTheme({ theme: { addonId } });
  return (
    <div>
      {staticThemesList.map((addonId, index) =>
        <button key={index} onClick={handleClick(addonId)}>{addonId}</button>)
      }
    </div>
  );

};

export default StaticThemePicker;
