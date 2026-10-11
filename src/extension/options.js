/* global Buffer */
import queryString from "query-string";
import msgpack5 from "msgpack5";
import safe64 from "urlsafe-base64";
import { LZMA_WORKER as lzma } from "lzma/src/lzma-d";
import { normalizeTheme } from "../lib/themes";

const msgpack = msgpack5();

// Same pipeline as json-url's "lzma" codec, which the editor uses to encode
// theme URLs: url-safe base64 -> LZMA -> msgpack. json-url's browser build
// cannot be bundled by webpack (see webpack.web.js), so decode with the
// packages it is built on.
// (LZMA returns a string only for valid UTF-8 output; a msgpack map never is.)
const decodeTheme = param =>
  new Promise((resolve, reject) => {
    lzma.decompress(safe64.decode(param), (result, error) =>
      error ? reject(error) : resolve(Buffer.from(result))
    );
  }).then(buffer => normalizeTheme(msgpack.decode(buffer)));

const $ = id => document.getElementById(id);

// Decode a shared theme URL (as produced by the Firefox Color editor).
// Resolves to null for an empty value; rejects if the URL is not decodable.
const decodeThemeUrl = value => {
  const trimmed = value.trim();
  if (!trimmed) {
    return Promise.resolve(null);
  }
  let param;
  try {
    param = queryString.parse(new URL(trimmed).search).theme;
  } catch (e) {
    return Promise.reject(new Error("Not a valid URL"));
  }
  if (!param) {
    return Promise.reject(
      new Error(
        "URL has no theme parameter (themes with custom backgrounds cannot be shared)"
      )
    );
  }
  return decodeTheme(param).catch(() => {
    throw new Error("Theme could not be decoded");
  });
};

const showStatus = (id, error) => {
  $(`${id}-status`).textContent = error ? error.message : "";
};

const save = () => {
  const light = $("light").value.trim();
  const dark = $("dark").value.trim();
  showStatus("light");
  showStatus("dark");

  return Promise.all(
    [["light", light], ["dark", dark]].map(([id, value]) =>
      decodeThemeUrl(value).then(
        theme => ({ id, theme }),
        error => ({ id, error })
      )
    )
  ).then(results => {
    const failed = results.filter(({ error }) => error);
    failed.forEach(({ id, error }) => showStatus(id, error));
    if (failed.length) {
      $("result").textContent = "";
      return null;
    }
    const [{ theme: lightTheme }, { theme: darkTheme }] = results;
    if (!lightTheme !== !darkTheme) {
      $("result").textContent = "Set both URLs, or clear both.";
      return null;
    }
    return browser.storage.local
      .set({
        // The URLs are only kept to refill the form; the themes are used.
        lightThemeUrl: light,
        darkThemeUrl: dark,
        lightTheme: lightTheme || null,
        darkTheme: darkTheme || null
      })
      .then(() => {
        $("result").textContent = "Saved.";
      });
  });
};

// Attach the handler before anything async so a failure can never fall
// through to a native form submit (which reloads the page and blanks it).
$("form").addEventListener("submit", event => {
  event.preventDefault();
  $("result").textContent = "Saving...";
  save().catch(error => {
    $("result").textContent = `Error: ${error.message}`;
  });
});

browser.storage.local
  .get(["lightThemeUrl", "darkThemeUrl"])
  .then(({ lightThemeUrl, darkThemeUrl }) => {
    $("light").value = lightThemeUrl || "";
    $("dark").value = darkThemeUrl || "";
  })
  .catch(error => {
    $("result").textContent = `Error: ${error.message}`;
  });
