import React from 'react';
import { connect } from 'react-redux';

import { actions, selectors } from '../../../../lib/store';

import AppBackground from '../AppBackground';
import BrowserPreview from '../BrowserPreview';
import ThemeColorsEditor from '../ThemeColorsEditor';
import ThemeBackgroundPicker from '../ThemeBackgroundPicker';
import ExtensionInstallButton from '../ExtensionInstallButton';

import './index.scss';

const mapStateToProps = state => ({
  theme: selectors.theme(state),
  hasExtension: selectors.hasExtension(state),
  selectedColor: selectors.selectedColor(state)
});

const mapDispatchToProps = dispatch => ({
  setBackground: args => dispatch(actions.theme.setBackground(args)),
  setColor: args => dispatch(actions.theme.setColor(args)),
  setSelectedColor: args => dispatch(actions.ui.setSelectedColor(args))
});

export const AppComponent = ({
  addonUrl,
  theme,
  hasExtension,
  selectedColor,
  setColor,
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
      <ThemeColorsEditor
        {...{ theme, selectedColor, setColor, setSelectedColor }}
      />
      <BrowserPreview {...{ theme, selectedColor, setSelectedColor }} />
      <ThemeBackgroundPicker {...{ theme, setBackground }} />
    </div>
  </div>;

export default connect(mapStateToProps, mapDispatchToProps)(AppComponent);
