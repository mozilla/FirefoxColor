import React from 'react';

import BrowserPreview from '../BrowserPreview';

import './index.scss';

export const SavedThemeSelector = ({ setTheme, savedThemes, deleteTheme }) => {
  const sortedSavedThemes = Object.entries(savedThemes).sort(
    ([, aData], [, bData]) => bData.modified - aData.modified
  );

  return (
    <div className="saved-theme-selector">
      <p>Saved themes:</p>
      {sortedSavedThemes.map(([key, { theme }]) => (
        <div key={key} className="saved-theme-preview">
          <button className="delete-theme" onClick={() => deleteTheme(key)}>
            Delete
          </button>
          <BrowserPreview {...{ size: 'small', theme, setTheme }} />
        </div>
      ))}
    </div>
  );
};

export default SavedThemeSelector;
