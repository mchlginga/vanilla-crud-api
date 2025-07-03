const fs = require("fs/promises");

const {PATHS} = require("./config.js");

// parse notes.json
const parseNotes = async() => {
    try {
        return JSON.parse(await fs.readFile(PATHS.noteFile, "utf-8"));
    } catch (error) {
        console.log("Error parsing notes:", error.message);
        return [];
    }
};

module.exports = parseNotes;