const fs = require("fs");
const path = require("path");
const tinycolor = require("tinycolor2");
const colorsWithAlpha = ["toolbar", "toolbar_field"];
const themesPath = path.join(__dirname, "..", "src", "preset-themes");

const makeTinycolor = colorIn => {
  let { a, s } = colorIn;
  return tinycolor({
    ...colorIn,
    a: Math.floor(a) / 100.0,
    s: Math.floor(s) / 100.0
  });
};

fs
  .readdirSync(themesPath)
  .filter(filename => path.extname(filename) === ".json")
  .forEach(filename => {
    const data = fs.readFileSync(path.join(themesPath, filename), "utf8");
    const theme = JSON.parse(data);
    Object.entries(theme.colors).forEach(([name, color]) => {
      const rgba = makeTinycolor(color).toRgb();
      if (!colorsWithAlpha.includes(name)) {
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
