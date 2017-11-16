import React from 'react';
import classnames from 'classnames';

import { colorToCSS } from '../../../../lib/utils';

import './index.scss';

const bgImages = require.context('../../../../images/', false, /bg-.*\.png/);

export const ThemeBackgroundPicker = ({ theme, setBackground }) => {
  const accentcolor = colorToCSS(theme.colors.accentcolor);

  const Background = ({ src, active }) =>
    <div
      className={classnames('bg', { active })}
      onClick={() => setBackground({ url: src })}
    >
      <div
        className="bg-inner"
        style={{
          backgroundColor: accentcolor,
          backgroundImage: `url(${bgImages(src)})`
        }}
      />
    </div>;

  return (
    <div className="theme-background-picker">
      <div className="backgrounds">
        {bgImages
          .keys()
          .map((src, key) =>
            <Background
              key={key}
              {...{ src, active: theme.images.headerURL === src }}
            />
          )}
      </div>
    </div>
  );
};

export default ThemeBackgroundPicker;
