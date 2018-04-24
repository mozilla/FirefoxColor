import React, { Fragment } from "react";
import { connect } from "react-redux";

import { actions, selectors } from "../../../../lib/store";
import { DEBUG } from "../../../../lib/utils";

import AppBackground from "../AppBackground";
import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import AppLoadingIndicator from "../AppLoadingIndicator";
import Banner from "../Banner";
import Mobile from "../Mobile";
import PresetThemeSelector from "../PresetThemeSelector";
import SavedThemeSelector from "../SavedThemeSelector";
import SharedThemeDialog from "../SharedThemeDialog";
import TermsPrivacyModal from "../TermsPrivacyModal";
import ThemeBuilder from "../ThemeBuilder";
import ThemeLogger from "../ThemeLogger";

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
  <Fragment>
    {isMobile &&
      <Mobile />
    }
    {!isMobile && !loaderDelayExpired &&
      <AppLoadingIndicator {...{ loaderQuote }} />
    }
    {!isMobile && loaderDelayExpired &&
      <div className="app">
        {hasExtension && shouldOfferPendingTheme &&
          <SharedThemeDialog
            {...{
              pendingTheme,
              setTheme,
              clearPendingTheme
            }}
          />
        }
        {!hasExtension &&
          <Banner
            {...{
              isFirefox,
              addonUrl,
              bottom: false
            }}
          />
        }
        <AppBackground {...{ theme }} />
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
          {hasSavedThemes &&
            <SavedThemeSelector
              {...{
                setTheme,
                savedThemes,
                savedThemesPage,
                setSavedThemesPage,
                deleteTheme: storage.deleteTheme
              }}
            />
          }
        </main>
        <AppFooter {...{ setDisplayLegalModal }} />
        <TermsPrivacyModal
          {...{
            displayLegalModal,
            setDisplayLegalModal
          }}
        />
        <ThemeLogger {...{ theme }} debug={DEBUG} />
      </div>
    }
  </Fragment>
);

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
