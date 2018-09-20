import React from "react";

const StaticThemePicker = props => {

  const { staticThemesList } = props;
  return (
    <div>
      {staticThemesList.map((item, index) =>
        <button key={index}>{item}</button>)
      }
    </div>
  );

};


export default StaticThemePicker;
