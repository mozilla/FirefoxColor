import React from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../../../lib/store";
import { DEBUG } from "../../../../lib/utils";

import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import AppBackground from "../AppBackground";
import PresetThemeSelector from "../PresetThemeSelector";
import Banner from "../Banner";
import SharedThemeDialog from "../SharedThemeDialog";
import AppLoadingIndicator from "../AppLoadingIndicator";
import ThemeLogger from "../ThemeLogger";
import SavedThemeSelector from "../SavedThemeSelector";
import TermsPrivacyModal from "../TermsPrivacyModal";
import ThemeBuilder from "../ThemeBuilder";

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
  setDisplayLegalModal: args => dispatch(actions.ui.setDisplayLegalModal(args)),
  undo: () => dispatch(actions.theme.undo()),
  redo: () => dispatch(actions.theme.redo())
});

export const AppComponent = ({
  loaderQuote,
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
  setDisplayLegalModal,
  displayLegalModal,
  undo,
  redo,
  storage,
  userHasEdited,
  modifiedSinceSave
}) => (
  <div className="app">
    {!loaderDelayExpired && <AppLoadingIndicator {...{ loaderQuote }} />}
    {hasExtension &&
      shouldOfferPendingTheme && (
        <SharedThemeDialog {...{ pendingTheme, setTheme, clearPendingTheme }} />
      )}
    <AppBackground {...{ theme }} />
    {!hasExtension &&
      !isMobile && <Banner {...{ isFirefox, addonUrl, bottom: false }} />}
    {loaderDelayExpired && (
      <main className="app__content">
        <AppHeader {...{ hasExtension }} />
        <ThemeBuilder
          {...{
            clipboard,
            modifiedSinceSave,
            redo,
            savedThemes,
            selectedColor,
            setBackground,
            setColor,
            setSelectedColor,
            storage,
            theme,
            themeCanRedo,
            themeCanUndo,
            undo,
            urlEncodeTheme,
            userHasEdited
          }}
        />
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
    <AppFooter {...{ setDisplayLegalModal }} />
    <TermsPrivacyModal {...{displayLegalModal, setDisplayLegalModal}} />
    <ThemeLogger {...{ theme }} debug={DEBUG} />
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
