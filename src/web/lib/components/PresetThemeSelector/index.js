import React from 'react';

import BrowserPreview from '../BrowserPreview';

import { presetColors } from '../../../../lib/constants';

import './index.scss';

export const PresetThemeSelector = ({ setTheme }) =>
  <div className="preset-theme-selector">
    <h2>Choose a preset theme</h2>
    { presetColors.map((colors, key) => {
      const theme = {
        images: '',
        colors
      };
      return (
        <div key={key} className="preset-theme-preview">
          <BrowserPreview {...{ size: 'small', theme, setTheme }} />
        </div>
      );
    })}
  </div>;

export default PresetThemeSelector;
