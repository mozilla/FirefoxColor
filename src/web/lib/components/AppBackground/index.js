import React from "react";

import { colorToCSS } from "../../../../lib/themes";

import "./index.scss";

export const AppBackground = ({ theme }) => {
  const style = {};

  // HACK: theme should not be undefined, but somehow it can be - track that down
  if (theme && theme.colors) {
    const colors = {};
    Object.keys(theme.colors).forEach(key => {
      colors[key] = colorToCSS(theme.colors[key]);
    });
    style.background =
      `linear-gradient(${colors.toolbar} 32.5%, ${colors.accentcolor} 78.1%)`;
  }

  return (
    <div className="app-background" style={style}>
      <div className="app-background__texture-1"/>
      <div className="app-background__texture-2"/>
    </div>
  );
};

export default AppBackground;
