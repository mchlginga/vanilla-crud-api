const fs = require("fs/promises");
const path = require("path");

const {PATHS} = require("./config.js");

// ensure notes.json exist
const ensureNoteFile = async() => {
    try {
        await fs.access(PATHS.noteFile);
    } catch (error) {
        await fs.mkdir(path.dirname(PATHS.noteFile), {recursive: true});
        await fs.writeFile(PATHS.noteFile, "[]");
    }
};

module.exports = ensureNoteFile;