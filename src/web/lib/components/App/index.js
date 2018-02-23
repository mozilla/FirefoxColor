import React from 'react';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../lib/store';

import AppFooter from '../AppFooter';
import AppHeader from '../AppHeader';
import AppBackground from '../AppBackground';
import BrowserPreview from '../BrowserPreview';
import ThemeColorsEditor from '../ThemeColorsEditor';
import PresetThemeSelector from '../PresetThemeSelector';
import ThemeBackgroundPicker from '../ThemeBackgroundPicker';
import Banner from '../Banner';
import SharedThemeDialog from '../SharedThemeDialog';
import AppLoadingIndicator from '../AppLoadingIndicator';
import ThemeUrl from '../ThemeUrl';
import ThemeSaveButton from '../ThemeSaveButton';
import SavedThemeSelector from '../SavedThemeSelector';

import './index.scss';

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
  undo: () => dispatch(actions.theme.undo()),
  redo: () => dispatch(actions.theme.redo())
});

export const AppComponent = ({
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
  shouldOfferPendingTheme,
  clearPendingTheme,
  setTheme,
  setSelectedColor,
  setBackground,
  undo,
  redo,
  storage
}) => (
  <div className="app">
    {!loaderDelayExpired && <AppLoadingIndicator />}
    {hasExtension &&
      shouldOfferPendingTheme && (
        <SharedThemeDialog {...{ pendingTheme, setTheme, clearPendingTheme }} />
      )}
    <AppBackground {...{ theme }} />
    {!hasExtension && <Banner {...{ addonUrl, bottom: false }} />}
    <div className="app-content">
      <AppHeader {...{ hasExtension }} />
      <BrowserPreview {...{ theme, setSelectedColor, size: 'large' }}>
        <ThemeUrl {...{ theme, urlEncodeTheme, clipboard }} />
        <ThemeSaveButton
          {...{
            theme,
            savedThemes,
            generateThemeKey: storage.generateThemeKey,
            putTheme: storage.putTheme
          }}
        />
      </BrowserPreview>
      <ThemeColorsEditor
        {...{
          theme,
          selectedColor,
          setColor,
          setSelectedColor,
          undo,
          redo,
          themeCanUndo,
          themeCanRedo
        }}
      />
      <PresetThemeSelector {...{ setTheme }} />
      <SavedThemeSelector
        {...{
          setTheme,
          savedThemes,
          deleteTheme: storage.deleteTheme
        }}
      />
      <ThemeBackgroundPicker {...{ theme, setBackground }} />
      <AppFooter/>
    </div>
  </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
