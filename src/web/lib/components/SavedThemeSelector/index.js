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
  const { themeStorage, imageStorage } = storage;
  const sortedSavedThemes = Object.entries(savedThemes).sort(
    ([, aData], [, bData]) => bData.modified - aData.modified
  );

  const deleteTheme = (key) => {
    // Get the current theme.
    const currentTheme = JSON.parse(localStorage.getItem(`THEME-${key}`));
    // Get the current theme's custom background images.
    const currentImageNames = (currentTheme.theme.images.custom_backgrounds || []).map(img => img.name);

    if (currentImageNames.length) {
      let allThemeImages = [];

      // Find all matching custom images in the other saved themes.
      sortedSavedThemes.forEach(([id, theme]) => {
        // Let's skip the current theme.
        if (id === key) return;

        const { images } = theme.theme;
        if (images.custom_backgrounds) {
          images.custom_backgrounds.forEach(bg => {
            if (currentImageNames.includes(bg.name)) {
              allThemeImages.push(bg.name);
            }
          });
        }
      });

      const notUsedImages = currentImageNames.filter(image => !allThemeImages.includes(image));

      notUsedImages.forEach((image) => {
        clearCustomBackground({ index: 0 });
        imageStorage.delete(image);
      });
    }

    themeStorage.delete(key);
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
