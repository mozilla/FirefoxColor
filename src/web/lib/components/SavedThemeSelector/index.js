import React from "react";

import PaginatedThemeSelector from "../PaginatedThemeSelector";

import "./index.scss";

export const SavedThemeSelector = ({
  setTheme,
  savedThemes,
  savedThemesPage,
  setSavedThemesPage,
  deleteTheme
}) => {
  const sortedSavedThemes = Object.entries(savedThemes).sort(
    ([, aData], [, bData]) => bData.modified - aData.modified
  );

  return (
    <PaginatedThemeSelector
      title="Saved themes"
      themes={sortedSavedThemes}
      className="saved-theme-selector"
      previewClassName="saved-theme-preview"
      onClick={theme => setTheme({ theme })}
      onDelete={key => deleteTheme(key)}
      perPage={8}
      currentPage={savedThemesPage}
      setCurrentPage={setSavedThemesPage}
    />
  );
};

export default SavedThemeSelector;
