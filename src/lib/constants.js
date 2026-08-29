export const CHANNEL_NAME = "FirefoxColor";

export const DOWNLOAD_FIREFOX_URL = `https://www.mozilla.org/firefox/new/?utm_campaign=firefoxcolor-acquisition&utm_medium=referral&utm_source=${
  process.env.DOWNLOAD_FIREFOX_UTM_SOURCE
}`;

export const CUSTOM_BACKGROUND_MAXIMUM_LENGTH = 3;

export const CUSTOM_BACKGROUND_MAXIMUM_SIZE = 1000000;

// Note: SVGs cannot be passed as base64.
// Bugzilla bug passed here https://bugzilla.mozilla.org/show_bug.cgi?id=1491790
// gifs also seem to break the background
export const CUSTOM_BACKGROUND_ALLOWED_TYPES = [
  "image/jpeg",
  "image/png"
  // "image/gif",
  // "image/bmp"
  // "image/svg+xml"
];

export const CUSTOM_BACKGROUND_DEFAULT_ALIGNMENT = "right top";

export const colorLabels = {
  toolbar: "Toolbar Color",
  toolbar_text: "Toolbar Icons and Text",
  frame: "Background Color",
  tab_background_text: "Background Tab Text Color",
  toolbar_field: "Search Bar Color",
  toolbar_field_text: "Search Text",
  tab_line: "Tab Highlight Color",
  popup: "Popup Background",
  popup_text: "Popup Text"
};

export const advancedColorLabels = {
  button_background_active: "Button Background Active",
  button_background_hover: "Button Background Hover",
  frame_inactive: "Frame Inactive",
  icons_attention: "Icons Attention",
  icons: "Icons",
  ntp_background: "New Tab Background Color",
  ntp_text: "New Tab Text",
  popup_border: "Popup Border",
  popup_highlight_text: "Popup Highlight Text",
  popup_highlight: "Popup Highlight",
  sidebar_border: "Sidebar Border",
  sidebar_highlight_text: "Sidebar Highlight Text",
  sidebar_highlight: "Sidebar Highlight",
  sidebar_text: "Sidebar Text",
  sidebar: "Sidebar",
  tab_background_separator: "Tab Background Separator (FF88-)",
  tab_loading: "Tab Loading",
  tab_selected: "Tab Selected",
  tab_text: "Tab Text",
  toolbar_bottom_separator: "Toolbar Bottom Separator",
  toolbar_field_border_focus: "Toolbar Field Border Focus",
  toolbar_field_border: "Toolbar Field Border",
  toolbar_field_focus: "Toolbar Field Focus",
  toolbar_field_highlight_text: "Toolbar Field Highlight Text",
  toolbar_field_highlight: "Toolbar Field Highlight",
  toolbar_field_separator: "Toolbar Field Separator (FF88-)",
  toolbar_field_text_focus: "Toolbar Field Text Focus",
  toolbar_top_separator: "Toolbar Top Separator",
  toolbar_vertical_separator: "Toolbar Vertical Separator"
};

export const fallbackColors = {
  frame: "accentcolor",
  // "popup" falls back to "frame" if "popup" is void.
  // If "frame" is somehow void, then "toolbar" is used instead.
  // This is for no particular reason, besides backwards-compatibility.
  // Similarly for "popup_text".
  popup: ["frame", "toolbar"],
  popup_text: ["toolbar_text", "tab_background_text", "textcolor"],
  tab_background_text: "textcolor"
};

export const colorsWithoutAlpha = ["tab_background_text", "frame", "sidebar"];

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
