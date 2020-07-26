const fs = require("fs");
const path = require("path");
const tinycolor = require("tinycolor2");
const colorsWithoutAlpha = ["tab_background_text", "frame", "sidebar"];
const themesPath = path.join(__dirname, "..", "src", "preset-themes");

const makeTinycolor = colorIn => {
  let { a, s } = colorIn;
  let newColor = tinycolor({
    ...colorIn,
    s: Math.floor(s) / 100.0
  });
  if (a) {
    newColor.a = Math.floor(a) / 100.0;
  }
  return newColor;
};

fs
  .readdirSync(themesPath)
  .filter(filename => path.extname(filename) === ".json")
  .forEach(filename => {
    const data = fs.readFileSync(path.join(themesPath, filename), "utf8");
    const theme = JSON.parse(data);
    Object.entries(theme.colors).forEach(([name, color]) => {
      const rgba = makeTinycolor(color).toRgb();
      if (colorsWithoutAlpha.includes(name) || (color && !("a" in color))) {
          delete rgba.a;
      }
      theme.colors[name] = rgba;
    });
    fs.writeFileSync(
      path.join(themesPath, filename),
      JSON.stringify(theme, null, "  "),
      "utf8"
    );
  });
