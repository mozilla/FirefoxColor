require("babel-register")({
  presets: [["env", { targets: ["last 2 versions"], modules: "commonjs" }], "react"],
  plugins: ["transform-object-rest-spread"]
});

const mockRequire = require("mock-require");

const mockContext = items => {
  const fn = key => items[key];
  fn.keys = () => Object.keys(items);
  return fn;
};

mockRequire("./assets", {
  presetThemesContext: mockContext({
  }),
  bgImages: mockContext({
  }),
  buttomImages: mockContext({
  })
});
