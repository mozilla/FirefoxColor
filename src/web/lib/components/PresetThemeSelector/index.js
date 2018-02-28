import React from 'react';

import BrowserPreview from '../BrowserPreview';

import { presetColors } from '../../../../lib/constants';
import Metrics from '../../../../lib/metrics';

import './index.scss';

export const PresetThemeSelector = ({ setTheme }) => (
  <div className="preset-theme-selector">
    <h2>Choose a preset theme</h2>
    {presetColors.map((colors, themeId) => {
      const theme = {
        images: '',
        colors
      };
      return (
        <div key={themeId} className="preset-theme-preview">
          <BrowserPreview
            {...{
              size: 'small',
              theme,
              onClick: () => {
                setTheme({ theme });
                Metrics.themeChangeFull(themeId);
              }
            }}
          />
        </div>
      );
    })}
  </div>
);

export default PresetThemeSelector;
