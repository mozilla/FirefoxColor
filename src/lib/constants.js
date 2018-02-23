export const CHANNEL_NAME = 'Themer';

export const surveyUrl = 'https://qsurvey.mozilla.com/s3/Test-Pilot-Themer-Feedback';

export const colorLabels = {
  toolbar: 'Toolbar Color',
  toolbar_text: 'Toolbar Icons and Text',
  accentcolor: 'Background Color',
  textcolor: 'Background Tab Text Color',
  toolbar_field: 'Search Bar Color',
  toolbar_field_text: 'Search Text'
};

export const colorsWithAlpha = [
  'toolbar',
  'toolbar_field'
];

export const defaultColors = {
  toolbar: {
    h: 213,
    s: 43,
    l: 89,
    a: 100
  },
  toolbar_text: {
    h: 187,
    s: 77,
    l: 53
  },
  accentcolor: {
    h: 213,
    s: 13,
    l: 47
  },
  textcolor: {
    h: 187,
    s: 77,
    l: 53
  },
  toolbar_field: {
    h: 213,
    s: 13,
    l: 47,
    a: 100
  },
  toolbar_field_text: {
    h: 0,
    s: 0,
    l: 100
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
