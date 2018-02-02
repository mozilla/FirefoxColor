import React from 'react';

import './index.scss';

// TODO: Actually show a real URL here
export const ThemeUrl = () =>
  <form className="theme-url">
    <label>Share your theme:</label>
    <fieldset>
      <input type="text" defaultValue="https://mythemerules.com" />
      <input type="submit" value="Copy" />
    </fieldset>
  </form>;

export default ThemeUrl;
