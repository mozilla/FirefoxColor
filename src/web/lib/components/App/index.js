import React, { Fragment } from "react";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";

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

const mapDispatchToProps = dispatch => {
  const themeUserEditDispatchers = [
    "setBackground",
    "setColor",
    "setTheme"
  ].reduce(
    (acc, name) => ({
      ...acc,
      [name]: args =>
        dispatch({
          ...actions.theme[name](args),
          meta: { userEdit: true }
        })
    }),
    {}
  );
  return {
    ...themeUserEditDispatchers,
    clearPendingTheme: () => dispatch(actions.ui.clearPendingTheme()),
    setSelectedColor: args => dispatch(actions.ui.setSelectedColor(args)),
    setSavedThemesPage: page =>
      dispatch(actions.ui.setSavedThemesPage({ page })),
    setDisplayLegalModal: args =>
      dispatch(actions.ui.setDisplayLegalModal(args)),
    undo: () => dispatch(actions.theme.undo()),
    redo: () => dispatch(actions.theme.redo())
  };
};

export const AppComponent = props => {
  const {
    isMobile,
    loaderDelayExpired,
    hasExtension,
    hasSavedThemes,
    shouldOfferPendingTheme,
    storage,
    firstRun
  } = props;
  return (
    <Fragment>
      {isMobile && <Mobile />}
      {!isMobile && !loaderDelayExpired && <AppLoadingIndicator {...props} />}
      {!isMobile &&
        loaderDelayExpired && (
          <Fragment>
            <AppHeader {...props} />
            <div className="app">
              {hasExtension &&
                shouldOfferPendingTheme && <SharedThemeDialog {...props} />}
              <AppBackground {...props} />
              <main className="app__content">
                <ThemeBuilder {...props} />
                {hasSavedThemes && (
                  <SavedThemeSelector
                    {...{
                      ...props,
                      deleteTheme: storage.deleteTheme
                    }}
                  />
                )}
                <PresetThemeSelector {...props} />
              </main>
              <AppFooter {...props} />
              <TermsPrivacyModal {...props} />
              {firstRun && <Onboarding />}
              <ThemeLogger {...props} debug={DEBUG} />
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

export default hot(module)(
  connect(mapStateToProps, mapDispatchToProps)(AppComponent)
);
