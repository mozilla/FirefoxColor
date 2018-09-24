import React from "react";

import PaginatedThemeSelector from "../PaginatedThemeSelector";

export const SavedThemeSelector = ({
  setTheme,
  savedThemes,
  savedThemesPage,
  setSavedThemesPage,
  themeCustomImages,
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
      perPage={6}
      currentPage={savedThemesPage}
      setCurrentPage={setSavedThemesPage}
      images={themeCustomImages}
    />
  );
};

export default SavedThemeSelector;
