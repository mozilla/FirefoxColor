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
    it("should find that all preset themes are self-identical", () => {
      presetThemesContext.keys().forEach(name => {
        const theme = presetThemesContext(name);
        const output = subject(theme, theme);
        expect(output).to.be.true;
      });
    });
  });
});
