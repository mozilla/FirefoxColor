const fs = require("fs");
const path = require("path");
const Ajv = require("ajv");

const themesPath = path.join(__dirname, "..", "src", "preset-themes");
const schemaFilename = path.join(__dirname, "..", "docs", "theme-schema.json");
const schema = JSON.parse(fs.readFileSync(schemaFilename, "utf8"));

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

let foundInvalid = false;

fs.readdirSync(themesPath)
  .filter(filename => path.extname(filename) === ".json")
  .forEach(filename => {
    const data = fs.readFileSync(path.join(themesPath, filename), "utf8");
    const theme = JSON.parse(data);
    if (!validate(theme)) {
      console.log(
        "Theme validation failed for",
        filename,
        ajv.errorsText(validate.errors)
      ); // eslint-disable-line no-console
      foundInvalid = true;
    }
  });

if (foundInvalid) {
  console.log("Found invalid theme JSON data"); // eslint-disable-line no-console
  process.exit(1);
}
