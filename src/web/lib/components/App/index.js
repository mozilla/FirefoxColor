import React, { Fragment } from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../../../lib/store";
import { DEBUG } from "../../../../lib/utils";

import AppBackground from "../AppBackground";
import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import AppLoadingIndicator from "../AppLoadingIndicator";
import Mobile from "../Mobile";
import PresetThemeSelector from "../PresetThemeSelector";
import SavedThemeSelector from "../SavedThemeSelector";
import SharedThemeDialog from "../SharedThemeDialog";
import TermsPrivacyModal from "../TermsPrivacyModal";
import ThemeBuilder from "../ThemeBuilder";
import ThemeLogger from "../ThemeLogger";
import Onboarding from "../Onboarding";

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
  setBackground: args => dispatch({
    ...actions.theme.setBackground(args),
    meta: { userEdit: true }
  }),
  setColor: args => dispatch({
    ...actions.theme.setColor(args),
    meta: { userEdit: true }
  }),
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
  firstRun,
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
  <Fragment>
    {isMobile && <Mobile />}
    {!isMobile &&
      !loaderDelayExpired && <AppLoadingIndicator {...{ loaderQuote }} />}
    {!isMobile &&
      loaderDelayExpired && (
        <Fragment>
          <AppHeader {...{ hasExtension, theme }} />
          <div className="app">
            {hasExtension &&
              shouldOfferPendingTheme && (
                <SharedThemeDialog
                  {...{
                    pendingTheme,
                    setTheme,
                    clearPendingTheme
                  }}
                />
              )}
            <AppBackground {...{ theme }} />
            <main className="app__content">
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
                  userHasEdited,
                  hasExtension,
                  firstRun,
                  isFirefox,
                  addonUrl
                }}
              />
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
              <PresetThemeSelector {...{ setTheme }} />
            </main>
            <AppFooter {...{ hasExtension, setDisplayLegalModal }} />
            <TermsPrivacyModal
              {...{
                displayLegalModal,
                setDisplayLegalModal
              }}
            />
            {firstRun && <Onboarding />}
            <ThemeLogger {...{ theme }} debug={DEBUG} />
          </div>
        </Fragment>
      )}
  </Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
