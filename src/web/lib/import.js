import JSZip from "jszip";

var fs = require("fs");
var JSZip = require("jszip");

// Logic that reads json file from zip and the filePath will be added
function jsonReader ( filePath, cb ) {
    fs.readFile(filePath, "utf-8", (err,data) => {
        if (err) {
            return cb && cb(err);
        }

        try {
            const object = JSON.parse(fileData);
            return cb && cb(null, object);
        } catch (err) {
            return cb && cb(err);
        }
    });

}