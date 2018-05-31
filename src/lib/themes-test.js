const { expect } = require("chai");
const { presetThemesContext } = require("./assets");
const themes = require("./themes");

describe("lib/themes", () => {
  describe("normalizeThemeColor", () => {
    const subject = themes.normalizeThemeColor;
    it("should properly handle alpha channel in colors", () => {
      const input = { r: 255, g: 255, b: 255, a: 0.5299999713897705 };
      const expected = { r: 255, g: 255, b: 255, a: 0.53 };
      const result = subject(input);
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
  });

  describe("themesEqual", () => {
    const subject = themes.themesEqual;

    it("should reject when one theme is null", () => {
      expect(
        subject(
          { colors: { toolbar: { r: 255, g: 255, b: 255 } } },
          null
        )
      ).to.be.false;
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
        subject(
          { images: { additional_backgrounds: ["foo"] } },
          { images: { } }
        )
      ).to.be.false;
      expect(
        subject(
          { images: { additional_backgrounds: ["foo"] } },
          { }
        )
      ).to.be.false;
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
