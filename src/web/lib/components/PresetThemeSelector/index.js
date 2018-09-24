import React from "react";

import PaginatedThemeSelector from "../PaginatedThemeSelector";

import { presetThemes } from "../../../../lib/themes";
import Metrics from "../../../../lib/metrics";

export const PresetThemeSelector = ({
  setTheme,
  presetThemesPage,
  setPresetThemesPage
}) => {
  const sortedPresetThemes = presetThemes.map(item => [
    item.idx,
    { theme: item }
  ]);

  return (
    <PaginatedThemeSelector
      title="Preset themes"
      themes={sortedPresetThemes}
      className="preset-theme-selector"
      previewClassName="preset-theme-preview"
      onClick={theme => {
        setTheme({ theme });
        Metrics.themeChangeFull(theme.title);
      }}
      perPage={6}
      currentPage={presetThemesPage}
      setCurrentPage={setPresetThemesPage}
    />
  );
};

export default PresetThemeSelector;
