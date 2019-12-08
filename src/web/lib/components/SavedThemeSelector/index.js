import React from "react";

import PaginatedThemeSelector from "../PaginatedThemeSelector";

export const SavedThemeSelector = ({
  setTheme,
  savedThemes,
  savedThemesPage,
  setSavedThemesPage,
  themeCustomImages,
  storage,
  clearCustomBackground
}) => {
  const { themeStorage } = storage;
  const sortedSavedThemes = Object.entries(savedThemes).sort(
    ([, aData], [, bData]) => bData.modified - aData.modified
  );

  const deleteTheme = (key) => {
    themeStorage.delete(key);
    clearCustomBackground({ index: 0 });
  };

  return (
    <PaginatedThemeSelector
      title="Saved themes"
      themes={sortedSavedThemes}
      className="saved-theme-selector"
      previewClassName="saved-theme-preview"
      onClick={theme => setTheme({ theme })}
      onDelete={key => deleteTheme(key)}
      perPage={9}
      currentPage={savedThemesPage}
      setCurrentPage={setSavedThemesPage}
      images={themeCustomImages}
    />
  );
};

export default SavedThemeSelector;
