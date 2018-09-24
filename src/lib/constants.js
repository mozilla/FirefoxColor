export const CHANNEL_NAME = "FirefoxColor";

export const DOWNLOAD_FIREFOX_URL = `https://www.mozilla.org/firefox/new/?utm_campaign=firefoxcolor-acquisition&utm_medium=referral&utm_source=${
  process.env.DOWNLOAD_FIREFOX_UTM_SOURCE
}`;

export const CUSTOM_BACKGROUND_MAXIMUM_LENGTH = 3;

export const CUSTOM_BACKGROUND_MAXIMUM_SIZE = 1000000;

// Note: SVGs cannot be passed as base64.
// Bugzilla bug passed here https://bugzilla.mozilla.org/show_bug.cgi?id=1491790
export const CUSTOM_BACKGROUND_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/bmp"
  // "image/svg+xml"
];

export const surveyUrl = "https://qsurvey.mozilla.com/s3/color";

export const colorLabels = {
  toolbar: "Toolbar Color",
  toolbar_text: "Toolbar Icons and Text",
  accentcolor: "Background Color",
  textcolor: "Background Tab Text Color",
  toolbar_field: "Search Bar Color",
  toolbar_field_text: "Search Text",
  tab_line: "Tab Highlight Color"
};

export const colorsWithAlpha = ["toolbar", "toolbar_field"];

export const alphaEqualityTolerance = 0.02;

export const ESC = 27;

export const loaderQuotes = [
  {
    quote:
      "Mere color, unspoiled by meaning, and unallied with definite form, can speak to the soul in a thousand different ways.",
    attribution: "Oscar Wilde"
  },
  {
    quote:
      "The purest and most thoughtful minds are those which love color the most.",
    attribution: "John Ruskin"
  },
  {
    quote:
      "I found I could say things with color and shapes that I couldn't say any other way — things I had no words for.",
    attribution: "Georgia O'Keeffe"
  },
  {
    quote: "Colours and colours and colours of colours",
    attribution: "Hot Chip"
  }
];
