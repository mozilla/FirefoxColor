import JSZip from "jszip";

import { selectors } from "../../lib/store";
import { convertToBrowserTheme } from "../../lib/themes";
import { makeLog } from "../../lib/utils";

const log = makeLog("export");

export default function performThemeExport({
  name = "Default Name",
  // TODO: Need other manifest attributes?
  store,
  bgImages
}) {
  log("performThemeExport");
  reset();

  const zip = new JSZip();
  const state = store.getState();
  const themeData = selectors.theme(state);
  const customBackgrounds = selectors.themeCustomImages(state);
  const theme = convertToBrowserTheme(themeData, bgImages, customBackgrounds);

  if (theme.images) {
    const { images } = theme;
    const { additional_backgrounds } = images;
    if (images.theme_frame) {
      images.theme_frame = addImage(zip, images.theme_frame);
    }
    if (additional_backgrounds) {
      for (let idx = 0; idx < additional_backgrounds.length; idx++) {
        additional_backgrounds[idx] = addImage(
          zip,
          additional_backgrounds[idx]
        );
      }
    }
  }

  const manifest = {
    manifest_version: 2,
    version: "1.0",
    name,
    theme
  };
  log("manifest", manifest);
  zip.file("manifest.json", JSON.stringify(manifest, null, "  "));

  return Promise.all(pendingImages)
    .then(() => zip.generateAsync({ type: "base64" }))
    .then(data => "data:application/x-xpinstall;base64," + data);
}

let pendingImages = [];
let currId = 0;
const genId = () => currId++;

function reset() {
  pendingImages = [];
  currId = 0;
}

const extensions = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/bmp": ".bmp"
};

function addImage(zip, data) {
  if (data.startsWith("data:")) {
    // Convert data: URL into binary file entry in zip
    const [meta, b64data] = data.split(",", 2);
    const [type] = meta.substr(5).split(/;/, 1);
    const filename = `images/${genId()}${extensions[type]}`;
    zip.file(filename, base64ToUint8array(b64data));
    return filename;
  }

  if (data.startsWith("images/")) {
    // Convert file path into pending image fetch.
    const filename = data;
    pendingImages.push(
      fetch(filename)
        .then(response => response.blob())
        .then(data => zip.file(filename, data))
    );
    return filename;
  }

  // TODO: Throw error? The previous conditions should be all known images
  return data;
}

function base64ToUint8array(s) {
  var byteChars = atob(s);
  var l = byteChars.length;
  var byteNumbers = new Array(l);
  for (var i = 0; i < l; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i);
  }
  return new Uint8Array(byteNumbers);
}
