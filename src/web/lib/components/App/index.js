import React from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../../../lib/store";
import { DEBUG } from "../../../../lib/utils";

import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import AppBackground from "../AppBackground";
import BrowserPreview from "../BrowserPreview";
import ThemeColorsEditor from "../ThemeColorsEditor";
import PresetThemeSelector from "../PresetThemeSelector";
import ThemeBackgroundPicker from "../ThemeBackgroundPicker";
import Banner from "../Banner";
import SharedThemeDialog from "../SharedThemeDialog";
import AppLoadingIndicator from "../AppLoadingIndicator";
import ThemeLogger from "../ThemeLogger";
import ThemeUrl from "../ThemeUrl";
import ThemeSaveButton from "../ThemeSaveButton";
import SavedThemeSelector from "../SavedThemeSelector";
import UndoRedoButtons from "../UndoRedoButtons";

import "./index.scss";

const mapStateToProps = state => {
  const mappedSelectors = Object.entries(selectors).reduce(
    (acc, [name, selector]) => ({ ...acc, [name]: selector(state) }),
    {}
  );
  return {
    ...mappedSelectors
  };
};

const mapDispatchToProps = dispatch => ({
  setBackground: args => dispatch(actions.theme.setBackground(args)),
  setColor: args => dispatch(actions.theme.setColor(args)),
  setTheme: args =>
    dispatch({
      ...actions.theme.setTheme(args),
      meta: { userEdit: true }
    }),
  clearPendingTheme: () => dispatch(actions.ui.clearPendingTheme()),
  setSelectedColor: args => dispatch(actions.ui.setSelectedColor(args)),
  setSavedThemesPage: page => dispatch(actions.ui.setSavedThemesPage({ page })),
  undo: () => dispatch(actions.theme.undo()),
  redo: () => dispatch(actions.theme.redo())
});

export const AppComponent = ({
  isFirefox,
  isMobile,
  addonUrl,
  urlEncodeTheme,
  clipboard,
  theme,
  themeCanUndo,
  themeCanRedo,
  hasExtension,
  loaderDelayExpired,
  selectedColor,
  setColor,
  pendingTheme,
  savedThemes,
  savedThemesPage,
  setSavedThemesPage,
  hasSavedThemes,
  shouldOfferPendingTheme,
  clearPendingTheme,
  setTheme,
  setSelectedColor,
  setBackground,
  undo,
  redo,
  storage,
  modifiedSinceSave
}) => (
  <div className="app">
    {!loaderDelayExpired && <AppLoadingIndicator />}
    {hasExtension &&
      shouldOfferPendingTheme && (
        <SharedThemeDialog {...{ pendingTheme, setTheme, clearPendingTheme }} />
      )}
    <AppBackground {...{ theme }} />
    {!hasExtension && !isMobile && <Banner {...{ isFirefox, addonUrl, bottom: false }} />}
    {loaderDelayExpired && (
      <main className="app__content">
        <AppHeader {...{ hasExtension }} />
        <BrowserPreview {...{ theme, setSelectedColor, size: "large" }}>
          <div className="app__theme-element-pickers">
            <ThemeColorsEditor
              {...{
                theme,
                selectedColor,
                setColor,
                setSelectedColor
              }}
            />
            <ThemeBackgroundPicker {...{ theme, setBackground }} />
            {(themeCanUndo || themeCanRedo) && (
              <UndoRedoButtons
                {...{ undo, redo, themeCanUndo, themeCanRedo }}
              />
            )}
          </div>
          <div className="app__controls">
            <ThemeUrl {...{ theme, urlEncodeTheme, clipboard }} />
            <ThemeSaveButton
              {...{
                theme,
                savedThemes,
                generateThemeKey: storage.generateThemeKey,
                putTheme: storage.putTheme
              }}
            />
          </div>
        </BrowserPreview>
        <PresetThemeSelector {...{ setTheme }} />
        {hasSavedThemes && (
          <SavedThemeSelector
            {...{
              setTheme,
              savedThemes,
              savedThemesPage,
              setSavedThemesPage,
              deleteTheme: storage.deleteTheme
            }}
          />
        )}
      </main>
    )}
    <AppFooter />
    <ThemeLogger {...{ theme }} debug={DEBUG} />
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
