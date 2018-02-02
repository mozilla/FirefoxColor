import React from 'react';

import BrowserPreview from '../BrowserPreview';

import { presetColors } from '../../../../lib/constants';

import './index.scss';

export const PresetThemeSelector = ({ setSelectedColor, setTheme }) =>
  <div className="preset-theme-selector">
    { presetColors.map((colors, key) => {
      const theme = {
        images: '',
        colors
      };
      return (
        <div key={key} className="preset-theme-preview">
          <BrowserPreview {...{ size: 'small', theme, setSelectedColor, setTheme }} />
        </div>
      );
    })}
  </div>;

export default PresetThemeSelector;
