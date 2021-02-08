import JSZip from "jszip";
const express = require ('express');
const multer = require ('multer');
const path = require ('path');
const unzipper = require (' ./unzip ');
const fs = require('fs');
const JSZip = require('jszip');

//multer for upload files
const storage = multer.diskStorage({
    destination: function( req, file, cb ) {
        cb( null, path.join(path.dirname(__dirname), 'zip_upload'))
    },
    filename: function ( req, file, cb ) {
        cb ( null, file.fieldname + '-' + Date.now() ) //fieldname will be declared later during development of frontned
    }
})

const upload = multer ({ storage: storage })

// ./unzip for extracting files inside zip folder
fs.createReadStream('zip_upload/')
    .pipe( unzipper.Parse() )
    .on('entry', function ( entry ) {
        const fileName = entry.path;
        const type = entry.type;
        const size = entry.vars.uncompressedSize;
        if ( fileName === "theme.zip" ) {
            entry.pipe( fs.createWriteStream( 'output/path' )); //this will store zip files to output/path
        } else {
            entry.autodrain();
        }
    });

// Logic that reads json file from zip
function jsonReader ( filepath, cb ) {
    fs.readFile(' ./output/path/manifest.json ', "utf-8", (err,data) => {
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