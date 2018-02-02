import React from 'react';

import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

export const AppBackground = ({ theme }) => {
  const colors = {};
  if (theme) {
    Object.keys(theme.colors).forEach(key => {
      colors[key] = colorToCSS(theme.colors[key]);
    });
  }

  const bgGradient = `linear-gradient(${colors.toolbar} 32.5%, ${colors.accentcolor} 78.1%)`;

  return (
    <div className="app-background" style={{ background: bgGradient }}>
      <div className="app-background__texture-1"/>
      <div className="app-background__texture-2"/>
    </div>
  );
};

export default AppBackground;
