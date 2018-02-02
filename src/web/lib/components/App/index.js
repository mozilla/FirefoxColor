import React from 'react';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../lib/store';

import AppBackground from '../AppBackground';
import BrowserPreview from '../BrowserPreview';
import ThemeColorsEditor from '../ThemeColorsEditor';
import PresetThemeSelector from '../PresetThemeSelector';
import ThemeBackgroundPicker from '../ThemeBackgroundPicker';
import ExtensionInstallButton from '../ExtensionInstallButton';
import ThemeUrl from '../ThemeUrl';

import './index.scss';

const mapStateToProps = state => ({
  theme: selectors.theme(state),
  hasExtension: selectors.hasExtension(state),
  selectedColor: selectors.selectedColor(state)
});

const mapDispatchToProps = dispatch => ({
  setBackground: args => dispatch(actions.theme.setBackground(args)),
  setColor: args => dispatch(actions.theme.setColor(args)),
  setTheme: args => dispatch(actions.theme.setTheme(args)),
  setSelectedColor: args => dispatch(actions.ui.setSelectedColor(args)),
});

export const AppComponent = ({
  addonUrl,
  theme,
  hasExtension,
  selectedColor,
  setColor,
  setTheme,
  setSelectedColor,
  setBackground
}) =>
  <div className="app">
    <AppBackground {...{ theme }} />
    {!hasExtension && <ExtensionInstallButton {...{ addonUrl }} />}
    <div className="app-content">
      <header>
        <h1>THEMEZ𝕽FUN!</h1>
        <p>A Firefox Test Pilot experiment</p>
      </header>
      <BrowserPreview {...{ theme, setSelectedColor, size: 'large' }}>
        <ThemeUrl />
      </BrowserPreview>
      <ThemeColorsEditor
        {...{ theme, selectedColor, setColor, setSelectedColor }}
      />
      <PresetThemeSelector {...{ setSelectedColor, setTheme }}/>
      <ThemeBackgroundPicker {...{ theme, setBackground }} />
    </div>
  </div>;

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
