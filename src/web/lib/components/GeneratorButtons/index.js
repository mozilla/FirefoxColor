import React from "react";
import {
  generateComplementaryTheme,
  generateRandomTheme
} from "../../../../lib/generators";

import "./index.scss";

export const GeneratorButtons = ({ setTheme, theme }) => {
  const handleComplementClick = () => {
    setTheme({ theme: generateComplementaryTheme() });
  };
  const handleRandomClick = () => {
    setTheme({ theme: generateRandomTheme() });
  };

  return (
    <div className="generator-buttons">
      <h2>Generate a theme</h2>
      <button className="generator-buttons__button" title="generate complementary theme" onClick={handleComplementClick}>
        Complementary
      </button>
      <button className="generator-buttons__button" title="generate random theme" onClick={handleRandomClick}>
        Random
      </button>
    </div>
  );
};

export default GeneratorButtons;
