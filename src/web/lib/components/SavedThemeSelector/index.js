import React from 'react';

import BrowserPreview from '../BrowserPreview';

import './index.scss';

import iconClose from './close.svg';

export const SavedThemeSelector = ({ setTheme, savedThemes, deleteTheme }) => {
  const sortedSavedThemes = Object.entries(savedThemes).sort(
    ([, aData], [, bData]) => bData.modified - aData.modified
  );

  return (
    <div className="saved-theme-selector">
      <h2>Saved themes</h2>
      {sortedSavedThemes.map(([key, { theme }]) => (
        <div key={key} className="saved-theme-preview">
          <button
            className="delete-theme"
            onClick={() => deleteTheme(key)}
            title="delete"
          >
            <img src={iconClose} />
          </button>
          <BrowserPreview
            {...{
              size: 'small',
              theme,
              onClick: () => setTheme({ theme })
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default SavedThemeSelector;
