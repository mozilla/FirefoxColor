import React, { Fragment } from "react";
import { connect } from "react-redux";
import { hot } from "react-hot-loader";

import { actions, selectors } from "../../../../lib/store";

import AppBackground from "../AppBackground";
import AppFooter from "../AppFooter";
import AppHeader from "../AppHeader";
import AppLoadingIndicator from "../AppLoadingIndicator";
import Mobile from "../Mobile";
import SharedThemeDialog from "../SharedThemeDialog";
import ExportThemeDialog from "../ExportThemeDialog";
import TermsPrivacyModal from "../TermsPrivacyModal";
import Onboarding from "../Onboarding";
import Banner from "../Banner";
import ThemeBuilder from "../ThemeBuilder";
import Browser from "../Browser";
import { getCustomImages } from "../../../../lib/utils";

import "./index.scss";

const mapStateToProps = state => {
  const mappedSelectors = Object.entries(selectors).reduce(
    (acc, [name, selector]) => ({ ...acc, [name]: selector(state) }),
    {}
  );
  return {
    presentImages: state.theme.present.images,
    ...mappedSelectors
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { performThemeExport } = ownProps;

  const themeUserEditDispatchers = [
    "setBackground",
    "setColor",
    "setTheme",
    "addCustomBackground",
    "updateCustomBackground",
    "clearCustomBackground",
    "moveCustomBackground"
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
    addImage: args => dispatch(actions.images.addImage(args)),
    updateImage: args => dispatch(actions.images.updateImage(args)),
    deleteImages: args => dispatch(actions.images.deleteImages(args)),
    clearPendingTheme: () => dispatch(actions.ui.clearPendingTheme()),
    setSelectedColor: args => dispatch(actions.ui.setSelectedColor(args)),
    setSavedThemesPage: page =>
      dispatch(actions.ui.setSavedThemesPage({ page })),
    setPresetThemesPage: page =>
      dispatch(actions.ui.setPresetThemesPage({ page })),
    setDisplayLegalModal: args =>
      dispatch(actions.ui.setDisplayLegalModal(args)),
    setDisplayShareModal: args =>
      dispatch(actions.ui.setDisplayShareModal(args)),
    setDisplayRemoveImageModal: args =>
      dispatch(actions.ui.setDisplayRemoveImageModal(args)),
    setThemeBuilderPanel: args =>
      dispatch(actions.ui.setThemeBuilderPanel(args)),
    undo: () => dispatch(actions.theme.undo()),
    redo: () => dispatch(actions.theme.redo()),
    setExportThemeProgress: progress =>
      dispatch(actions.ui.setExportThemeProgress(progress)),
    showExportThemeDialog: args =>
      dispatch(actions.ui.showExportThemeDialog(args)),
    exportTheme: args =>
      dispatch(actions.ui.exportTheme(performThemeExport(args))),
    clearExportedTheme: () => dispatch(actions.ui.clearExportedTheme()),
    setUsedStorage: args => dispatch(actions.ui.setUsedStorage(args)),
    setStorageErrorMessage: args =>
      dispatch(actions.ui.setStorageErrorMessage(args))
  };
};

export const AppComponent = props => {
  const {
    isMobile,
    loaderDelayExpired,
    hasExtension,
    shouldOfferPendingTheme,
    firstRun,
    isFirefox,
    addonUrl,
    setSelectedColor,
    selectedColor,
    theme,
    themeCustomImages,
    themeHasCustomBackgrounds
  } = props;

  const customImages = getCustomImages(theme.images.custom_backgrounds, themeCustomImages);

  return (
    <Fragment>
      {isMobile && <Mobile />}
      {!isMobile && !loaderDelayExpired && <AppLoadingIndicator {...props} />}
      {!isMobile &&
        loaderDelayExpired && (
          <Fragment>
            <div className="app">
              <AppBackground {...props} />
              {shouldOfferPendingTheme && <SharedThemeDialog {...props} />}
              {<ExportThemeDialog {...props} />}
              <AppHeader {...props} />
              <main className="app__main">
                <Browser
                  {...{
                    theme,
                    themeHasCustomBackgrounds,
                    customImages,
                    selectedColor
                  }}
                  size="large"
                  showPopup={hasExtension}
                >
                  <Fragment>
                    {!hasExtension && (
                      <Banner
                        {...{
                          isFirefox,
                          addonUrl,
                          selectedColor,
                          setSelectedColor
                        }}
                      />
                    )}
                    {hasExtension && <div className="app__firefox" />}
                    <ThemeBuilder {...props} />
                  </Fragment>
                </Browser>
              </main>
              <AppFooter {...props} />
              <TermsPrivacyModal {...props} />
              {firstRun && <Onboarding />}
            </div>
          </Fragment>
        )}
    </Fragment>
  );
};

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppComponent)
);
