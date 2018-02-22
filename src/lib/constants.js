export const CHANNEL_NAME = 'Themer';

export const surveyUrl = 'https://qsurvey.mozilla.com/s3/Test-Pilot-Themer-Feedback';

export const colorLabels = {
  toolbar: 'Toolbar Color',
  toolbar_text: 'Toolbar Text Color',
  accentcolor: 'Tab Bar Background Color',
  textcolor: 'Background Tab Text Color',
  toolbar_field: 'Toolbar Input Background Color',
  toolbar_field_text: 'Toolbar Input Text Color'
};

export const colorsWithAlpha = [
  'toolbar',
  'toolbar_field'
];

export const defaultColors = {
  toolbar: {
    h: 180,
    s: 44,
    l: 96,
    a: 100
  },
  toolbar_text: {
    h: 174,
    s: 42,
    l: 65,
  },
  accentcolor: {
    h: 360,
    s: 100,
    l: 100
  },
  textcolor: {
    h: 174,
    s: 42,
    l: 65
  },
  toolbar_field: {
    h: 360,
    s: 100,
    l: 100,
    a: 100
  },
  toolbar_field_text: {
    h: 174,
    s: 42,
    l: 65
  },
};

export const presetColors = [
  {
    toolbar: {
      h: 0,
      s: 50,
      l: 50,
      a: 100
    },
    toolbar_text: {
      h: 0,
      s: 0,
      l: 0,
    },
    accentcolor: {
      h: 0,
      s: 0,
      l: 0
    },
    textcolor: {
      h: 0,
      s: 0,
      l: 0
    },
    toolbar_field: {
      h: 0,
      s: 0,
      l: 0,
      a: 100
    },
    toolbar_field_text: {
      h: 0,
      s: 0,
      l: 100
    }
  }, {
    toolbar: {
      h: 180,
      s: 50,
      l: 50,
      a: 100
    },
    toolbar_text: {
      h: 360,
      s: 100,
      l: 100,
    },
    accentcolor: {
      h: 360,
      s: 100,
      l: 100
    },
    textcolor: {
      h: 360,
      s: 100,
      l: 100
    },
    toolbar_field: {
      h: 360,
      s: 100,
      l: 100,
      a: 100
    },
    toolbar_field_text: {
      h: 0,
      s: 0,
      l: 0
    }
  }
];
