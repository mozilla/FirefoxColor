import React from "react";

import PaginatedThemeSelector from "../PaginatedThemeSelector";

import "./index.scss";

export const SavedThemeSelector = ({
  setTheme,
  savedThemes,
  savedThemesPage,
  setSavedThemesPage,
  storage
}) => {
  const { themeStorage } = storage;
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
      onDelete={key => themeStorage.delete(key)}
      perPage={12}
      currentPage={savedThemesPage}
      setCurrentPage={setSavedThemesPage}
    />
  );
};

export default SavedThemeSelector;
