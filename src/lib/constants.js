export const CHANNEL_NAME = "FirefoxColor";

export const DOWNLOAD_FIREFOX_URL = `https://www.mozilla.org/firefox/new/?utm_campaign=firefoxcolor-acquisition&utm_medium=referral&utm_source=${
  process.env.DOWNLOAD_FIREFOX_UTM_SOURCE
}`;

export const surveyUrl = "https://qsurvey.mozilla.com/s3/color";

export const colorLabels = {
  accentcolor: "accentcolor",
  button_background_active: "button_background_active",
  button_background_hover: "button_background_hover",
  icons_attention: "icons_attention",
  icons: "icons",
  ntp_background: "ntp_background",
  ntp_text: "ntp_text",
  popup_border: "popup_border",
  popup_highlight_text: "popup_highlight_text",
  popup_highlight: "popup_highlight",
  popup_text: "popup_text",
  popup: "popup",
  tab_background_separator: "tab_background_separator",
  tab_line: "tab_line",
  tab_loading: "tab_loading",
  tab_selected: "tab_selected",
  tab_text: "tab_text",
  textcolor: "textcolor",
  toolbar_bottom_separator: "toolbar_bottom_separator",
  toolbar_field_border_focus: "toolbar_field_border_focus",
  toolbar_field_border: "toolbar_field_border",
  toolbar_field_separator: "toolbar_field_separator",
  toolbar_field_text_focus: "toolbar_field_text_focus",
  toolbar_field_text: "toolbar_field_text",
  toolbar_field: "toolbar_field",
  toolbar_field_focus: "toolbar_field_focus",
  toolbar_text: "toolbar_text",
  toolbar_top_separator: "toolbar_top_separator",
  toolbar_vertical_separator: "toolbar_vertical_separator",
  toolbar: "toolbar",
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
