const fs = require("fs");
const path = require("path");

require("babel-register")({
  presets: [
    ["env", { targets: ["last 2 versions"], modules: "commonjs" }],
    "react"
  ],
  plugins: ["transform-object-rest-spread"]
});

const mockRequire = require("mock-require");

// Quick & dirty simulation of Webpack's require.context()
const mockContext = (itemsPath, filterFn, loadFn) => {
  const items = fs
    .readdirSync(itemsPath)
    .filter(filterFn)
    .reduce(
      (out, filename) => ({
        ...out,
        [`./${filename}`]: loadFn(filename)
      }),
      {}
    );
  const fn = key => items[key];
  fn.keys = () => Object.keys(items);
  return fn;
};

const presetThemesPath = path.join(__dirname, "..", "preset-themes");

mockRequire("./assets", {
  presetThemesContext: mockContext(
    presetThemesPath,
    filename => path.extname(filename) === ".json",
    filename =>
      JSON.parse(fs.readFileSync(path.join(presetThemesPath, filename), "utf8"))
  ),
  bgImages: mockContext(
    path.join(__dirname, "..", "images", "patterns"),
    filename => path.extname(filename) === ".svg",
    () => "FAKE IMAGE DATA"
  ),
  buttomImages: mockContext(
    path.join(__dirname, "..", "images"),
    filename => filename.includes("-16.svg"),
    () => "FAKE IMAGE DATA"
  )
});
