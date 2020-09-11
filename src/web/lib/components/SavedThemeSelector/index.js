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

  const deleteTheme = key => {
    const themeBeingDeleted = themeStorage.get(key);
    themeStorage.delete(key);
    const { images } = themeBeingDeleted.theme;

    // Remove current images from the display and if it's not present in other themes, from local storage .
    if (
      images &&
      images.custom_backgrounds &&
      images.custom_backgrounds.length
    ) {
      const entries = Object.entries(savedThemes);
      let themes = entries.filter(([entry]) => entry !== key);
      const values = Object.values(themes);

      const savedThemeImages = values
        .map(([_, item]) => item.theme.images.custom_backgrounds)
        .reduce((acc, item) => {
          (item || []).forEach((bg, i) => {
            acc.push(bg.name);
          });
          return acc;
        }, []);

      const { custom_backgrounds: customImages } = images;
      const currentImages = customImages.map(({ name }) => name);

      for (let index = currentImages.length - 1; index >= 0; index--) {
        if (!savedThemeImages.includes(currentImages[index])) {
          clearCustomBackground({ index });
        }
      }
    } else {
      // If no current images are in preview, then remove unused background images
      // from local storage.
      clearCustomBackground({ index: 0 });
    }
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
