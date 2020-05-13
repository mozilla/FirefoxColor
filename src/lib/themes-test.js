const { expect } = require("chai");
const { presetThemesContext, bgImages } = require("./assets");
const themes = require("./themes");

describe("lib/themes", () => {
  describe("normalizeThemeColor", () => {
    const subject = themes.normalizeThemeColor;

    it("should properly handle alpha channel in colors with alpha", () => {
      const input = { r: 255, g: 255, b: 255, a: 0.5299999713897705 };
      const expected = { r: 255, g: 255, b: 255, a: 0.53 };
      const result = subject("toolbar", input);
      expect(result).to.deep.equal(expected);
    });

    it("should properly remove alpha channel in colors without alpha", () => {
      const input = { r: 255, g: 255, b: 255, a: 0.5299999713897705 };
      const expected = { r: 255, g: 255, b: 255 };
      const result = subject("tab_line", input);
      expect(result).to.deep.equal(expected);
    });
  });

  describe("normalizeTheme", () => {
    const subject = themes.normalizeTheme;

    it("should not change preset themes", () => {
      presetThemesContext.keys().forEach(name => {
        // There are some acceptable differences from preset themes
        const theme = {
          images: { additional_backgrounds: [] },
          ...presetThemesContext(name)
        };
        const output = subject(theme);
        expect(output).to.deep.equal(theme);
      });
    });

    it("should migrate themes without popup/popup_text", () => {
      const theme = {
        images: {
          headerURL: "./bg-000.svg",
        },
        colors: {
          frame: { r: 12, g: 34, b: 56 },
          toolbar: { r: 1, g: 2, b: 3, a: 1 },
          toolbar_text: { r: 7, g: 8, b: 9 },
        },
        title: ["old theme without popup"],
      };
      const expectedTheme = {
        images: { additional_backgrounds: ["./bg-000.svg"] },
        colors: {
          ...presetThemesContext("./default.json").colors,
          frame: { r: 12, g: 34, b: 56 },
          popup: { r: 12, g: 34, b: 56 }, // default to frame.
          popup_text: { r: 7, g: 8, b: 9 }, // default to toolbar_text.
          toolbar: { r: 1, g: 2, b: 3, a: 1 },
          toolbar_text: { r: 7, g: 8, b: 9 },
        },
        title: ["old theme without popup"],
      };
      const output = subject(theme);
      expect(output).to.deep.equal(expectedTheme);
    });

    it("should migrate deprecated theme properties", () => {
      const deprecatedTheme = {
        images: {
          headerURL: "./bg-001.svg",
        },
        colors: {
          accentcolor: { r: 12, g: 34, b: 56 },
          textcolor: { r: 7, g: 8, b: 9 },
        },
        title: ["custom theme"],
      };
      const expectedTheme = {
        images: { additional_backgrounds: ["./bg-001.svg"] },
        colors: {
          ...presetThemesContext("./default.json").colors,
          frame: { r: 12, g: 34, b: 56 },
          tab_background_text: { r: 7, g: 8, b: 9 },
          popup_text: { r: 7, g: 8, b: 9 }, // defaults to tab_background_text.
        },
        title: ["custom theme"],
      };
      // Deep-clone the original input.
      const themeInput = JSON.parse(JSON.stringify(deprecatedTheme));
      const output = subject(themeInput);
      expect(output).to.deep.equal(expectedTheme);

      // Input object should not have been changed.
      expect(themeInput).to.deep.equal(deprecatedTheme);
    });

    it("should include advanced colors themes", () => {
      const advancedColors = ["button_background_active", "button_background_hover", "frame_inactive",
        "icons_attention", "icons", "ntp_background", "ntp_text", "popup_border", "popup_highlight_text",
        "popup_highlight", "sidebar_border", "sidebar_highlight_text", "sidebar_highlight", "sidebar_text", "sidebar",
        "tab_background_separator", "tab_loading", "tab_selected", "tab_text", "toolbar_bottom_separator",
        "toolbar_field_border_focus", "toolbar_field_border", "toolbar_field_focus", "toolbar_field_highlight_text",
        "toolbar_field_highlight", "toolbar_field_separator", "toolbar_field_text_focus", "toolbar_top_separator",
        "toolbar_vertical_separator"
      ];
      advancedColors.forEach(advancedColor => {
        const theme = {
          colors: {
            ...presetThemesContext("./default.json").colors,
          },
          title: ["custom theme"],
        };
        theme.colors[advancedColor] = { r: 12, g: 34, b: 56 };

        const output = subject(theme);

        expect(output.colors[advancedColor]).to.deep.equal({ r: 12, g: 34, b: 56 });
      });
    });
  });

  describe("convertToBrowserTheme", () => {
    const subject = themes.convertToBrowserTheme;
    const defaultBrowserTheme = () => {
      return {
        colors: {
          frame: "rgb(142, 179, 201)",
          popup: "rgb(255, 255, 255)",
          popup_text: "rgb(98, 102, 183)",
          tab_background_text: "rgb(255, 255, 255)",
          tab_line: "rgb(248, 112, 140)",
          tab_loading: "rgb(248, 112, 140)",
          toolbar: "rgb(225, 234, 239)",
          toolbar_field: "rgb(255, 255, 255)",
          toolbar_field_text: "rgb(123, 127, 204)",
          toolbar_text: "rgb(248, 112, 140)",
        },
        images: {},
        properties: {},
      };
    };

    it("should return a default theme", () => {
      expect(subject({}, bgImages, [])).to.deep.equal(defaultBrowserTheme());
    });

    it("should support images", () => {
      const theme = {
        images: {
          theme_frame: "./bg-000.svg",
        },
      };
      const expectedTheme = {
        ...defaultBrowserTheme(),
        images: {
          additional_backgrounds: [bgImages("./bg-000.svg")],
        },
        properties: {
          additional_backgrounds_alignment: ["top"],
          additional_backgrounds_tiling: ["repeat"],
        }
      };
      expect(subject(theme, bgImages, [])).to.deep.equal(expectedTheme);
    });

    it("should discard non-existing images", () => {
      const theme = {
        images: {
          theme_frame: "./i-do-not-exist.png",
        },
      };
      expect(subject(theme, bgImages, [])).to.deep.equal(defaultBrowserTheme());
    });

    it("should discard deprecated theme properties", () => {
      const theme = {
        images: {
          theme_frame: "./bg-001.svg",
        },
        colors: {
          accentcolor: { r: 123, g: 45, b: 67 },
          textcolor: { r: 234, g: 56, b: 78 },
        },
      };
      const expectedTheme = {
        colors: {
          ...defaultBrowserTheme().colors,
          frame: "rgb(123, 45, 67)",
          tab_background_text: "rgb(234, 56, 78)",
          popup_text: "rgb(234, 56, 78)",
        },
        images: {
          additional_backgrounds: [bgImages("./bg-001.svg")],
        },
        properties: {
          additional_backgrounds_alignment: ["top"],
          additional_backgrounds_tiling: ["repeat"],
        }
      };
      expect(subject(theme, bgImages, [])).to.deep.equal(expectedTheme);
    });

    // TODO: Add test for third parameter (customBackgrounds) of convertToBrowserTheme.
  });

  describe("themesEqual", () => {
    const subject = themes.themesEqual;

    it("should reject when one theme is null", () => {
      expect(subject({ colors: { toolbar: { r: 255, g: 255, b: 255 } } }, null))
        .to.be.false;
    });

    it("should reject difference in color properties", () => {
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          { colors: { button: { r: 255, g: 255, b: 255 } } }
        )
      ).to.be.false;
    });

    it("should reject difference in RGB channels", () => {
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } }
        )
      ).to.be.true;
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          { colors: { toolbar: { r: 128, g: 255, b: 255 } } }
        )
      ).to.be.false;
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          { colors: { toolbar: { r: 255, g: 128, b: 255 } } }
        )
      ).to.be.false;
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          { colors: { toolbar: { r: 255, g: 255, b: 128 } } }
        )
      ).to.be.false;
    });

    it("should reject difference in number of colors", () => {
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 }, ntp_background: { r: 0, g: 0, b: 255 } } },
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } }
        )
      ).to.be.false;
    });

    it("should reject difference in custom backgrounds", () => {
      expect(
        subject(
          {
            images: { custom_backgrounds: [{ name: "foo" }, { name: "baz" }] }
          },
          { images: { custom_backgrounds: [{ name: "foo" }, { name: "baz" }] } }
        )
      ).to.be.true;
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          { images: { custom_backgrounds: [{ name: "foo" }, { name: "baz" }] } }
        )
      ).to.be.false;
      expect(
        subject(
          {
            images: { custom_backgrounds: [{ name: "foo" }, { name: "baz" }] }
          },
          { images: { custom_backgrounds: [{ name: "baz" }, { name: "foo" }] } }
        )
      ).to.be.false;
      expect(
        subject(
          {
            images: { custom_backgrounds: [{ name: "foo" }, { name: "baz" }] }
          },
          {
            images: {
              custom_backgrounds: [
                { name: "foo" },
                { name: "baz" },
                { name: "quux" }
              ]
            }
          }
        )
      ).to.be.false;
    });

    it("should reject difference in images", () => {
      expect(
        subject(
          { images: { additional_backgrounds: ["foo"] } },
          { images: { additional_backgrounds: ["foo"] } }
        )
      ).to.be.true;
      expect(
        subject(
          { images: { additional_backgrounds: ["foo"] } },
          { images: { additional_backgrounds: ["bar"] } }
        )
      ).to.be.false;
      expect(
        subject({ images: { additional_backgrounds: ["foo"] } }, { images: {} })
      ).to.be.false;
      expect(subject({ images: { additional_backgrounds: ["foo"] } }, {})).to.be
        .false;
    });

    it("should be a little fuzzy on alpha channel equality because JS math is hard", () => {
      expect(
        subject(
          {
            colors: {
              toolbar: { r: 255, g: 255, b: 255, a: 0.53 },
              button: { r: 255, g: 255, b: 255, a: 0.85 }
            }
          },
          {
            colors: {
              toolbar: { r: 255, g: 255, b: 255, a: 0.52 },
              button: { r: 255, g: 255, b: 255, a: 0.86 }
            }
          }
        )
      ).to.be.true;
    });

    it("should find that all preset themes are self-identical", () => {
      presetThemesContext.keys().forEach(name => {
        const theme = presetThemesContext(name);
        const output = subject(theme, theme);
        expect(output).to.be.true;
      });
    });
  });
});
