import $ from './lib/jquery.min.js';
import React from 'react';
import { render } from 'react-dom';

import { CHANNEL_NAME, defaultColors } from '../lib/constants';

import BrowserPreview from './lib/components/BrowserPreview';

import './index.scss';

const appColors = [];
let backgroundIndex = 0;

const renderBrowserPreview = () => {
  const theme = { backgroundIndex, colors: {} };
  defaultColors.forEach((defaultColor, idx) => {
    const color = appColors[idx] || defaultColor;
    let val;
    if (typeof color.a !== 'undefined') {
      const alpha = color.a * 0.01;
      val = `hsla(${color.h},${color.s}%,${color.l}%, ${alpha})`;
    } else {
      val = `hsl(${color.h},${color.s}%,${color.l}%)`;
    }
    theme.colors[color.slug] = val;
  });
  render(
    <BrowserPreview {...theme} />,
    document.querySelector('.preview')
  );
};

const postMessage = (type, index, target, value) => {
  window.postMessage({
    channel: `${CHANNEL_NAME}-background`,
    type,
    index,
    target,
    value
  }, '*');
};

const setHSLSliderSet = (color, $target, source) => {
  const lForH = (color.l > 99) ? 99 : color.l;
  const $h = $target.find('.h');
  const $s = $target.find('.s');
  const $l = $target.find('.l');
  const $a = $target.find('.a');
  $h.css('background-image', `linear-gradient(
    90deg,
    hsl(0, ${color.s}%, ${lForH}%),
    hsl(60, ${color.s}%, ${lForH}%),
    hsl(120, ${color.s}%, ${lForH}%),
    hsl(180, ${color.s}%, ${lForH}%),
    hsl(240, ${color.s}%, ${lForH}%),
    hsl(300, ${color.s}%, ${lForH}%),
    hsl(360, ${color.s}%, ${lForH}%)`);
  $s.css('background-image', `linear-gradient(
    90deg,
    hsl(${color.h},0%, ${color.l}%),
    hsl(${color.h},100%, ${color.l}%)`);
  $l.css('background-image', `linear-gradient(
    90deg,
    hsl(${color.h}, ${color.s}%, 0%),
    hsl(${color.h}, ${color.s}%, 100%)`);
  $a.css('background-image', `linear-gradient(
    90deg,
    white,
    hsl(${color.h}, ${color.s}%, ${color.l}%)`);
  if (typeof $a === 'undefined') {
    const alpha = color.a * 0.01;
    console.log($a === false)
    $target.css('border-top', `3px solid hsla(${color.h},${color.s}%,${color.l}%, ${alpha})`);
  } else {
    $target.css('border-top', `3px solid hsl(${color.h},${color.s}%,${color.l}%)`);
  }
  if (source === 'sliders') {
    $target.find('.h-text').val(color.h);
    $target.find('.s-text').val(color.s);
    $target.find('.l-text').val(color.l);
  } else if (source === 'text') {
    $h.val(color.h);
    $s.val(color.s);
    $l.val(color.l);
    $a.val(color.a);
  }
};

const updateColors = (index, target, value, source) => {
  appColors[index][target] = value;
  const color = appColors[index];
  const $target = $('.picker-set').eq(index);
  setHSLSliderSet(color, $target, source);
  if (index === 2) {
    $('.bg-inner').css('background-color', `hsl(${color.h}, ${color.s}%, ${color.l}%)`);
  }
  renderBrowserPreview();
};

const initColors = (colors) => {
  let i = 0;
  for (const color of colors) {
    appColors.push(color);
    $('.picker-sets').append(`
      <form class='picker-set' id=${color.slug} data-unit=${i}>
        <h2>${color.name}</h2>
        <label>hue</label>
        <div>
          <input type='range' min='0' max='360' class='h' value=${color.h} tabIndex='-1'/>
          <input type='number' value=${color.h} class='h-text' maxlength="3" max="360" min="0" />
        </div>
        <label>saturation</label>
        <div>
          <input type='range' min='0' max='100' class='s' value=${color.s} tabIndex='-1'/>
          <input type='number' value=${color.s} class='s-text' maxlength="3" max="360" min="0" />
        </div>
        <label>lightness</label>
        <div>
          <input type='range' min='0' max='100' class='l' value=${color.l} tabIndex='-1'/>
          <input type='number' value=${color.l} class='l-text' maxlength="3" max="360" min="0" />
        </div>
      </form>`);
    i += 1;
  }

  $('.picker-set').each(function cb(index) {
    if (typeof colors[index].a !== 'undefined') {
      $(this).append(`<label>opacity</label>
        <div>
          <input type='range' min='0' max='100' class='a' value=${colors[index].a} tabIndex='-1'/>
          <input type='number' value=${colors[index].a} class='a-text' maxlength="3" max="100" min="0" />
        </div>`);
    }
  });

  $('.picker-set').each(function cb(index) {
    setHSLSliderSet(appColors[index], $(this));
  });
};

const initBackgrounds = (background, color) => {
  for (let i = 0; i <= 20; i += 1) {
    $('.backgrounds').append(`<div class="bg bg-${i}">
        <div class="bg-inner" style="background-color: hsl(${color.h}, ${color.s}%, ${color.l}%);
             background-image: url(images/bg-${i}.png)"></div></div>
      </div>`);
  }
  $('.bg').eq(background).addClass('active');
};

const bindSliders = () => {
  $('.h, .s, .l, .a').bind('input', function cb() {
    const index = parseInt($(this).closest('form').attr('data-unit'), 10);
    const target = $(this).attr('class');
    const value = parseInt($(this).val(), 10);
    postMessage('update-color', index, target, value);
    updateColors(index, target, value, 'sliders');
  });
};

const bindBackgrounds = () => {
  $('.bg').click(function cb() {
    const index = $(this).index();
    $('.bg').removeClass('active');
    $(this).addClass('active');
    postMessage('update-background', index);
    backgroundIndex = index;
    renderBrowserPreview();
  });
};

const bindNumInputs = () => {
  $('.h-text, .s-text, .l-text, .a-text').on('input', function cb() {
    const value = parseInt($(this).val(), 10);
    const min = $(this).attr('min');
    const max = $(this).attr('max');
    if (value >= min && value <= max) {
      const index = parseInt($(this).closest('form').attr('data-unit'), 10);
      const target = $(this).attr('class').slice(0, 1);

      updateColors(index, target, value, 'text');
    }
  });
};

const init = (message) => {
  initColors(message.colors);
  initBackgrounds(message.background, message.colors[2]);
  bindSliders();
  bindNumInputs();
  bindBackgrounds();
  renderBrowserPreview();
};

window.addEventListener('message', event => {
  if (
    event.source === window &&
    event.data &&
    event.data.channel === `${CHANNEL_NAME}-web`
  ) {
    if (event.data.type === 'init') { init(event.data); }
  }
});

renderBrowserPreview();
