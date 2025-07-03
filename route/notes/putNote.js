const fs = require("fs/promises");
const {parse} = require("url");

// lib
const parseNotes = require("../../lib/parseNotes.js");
const parseBody = require("../../lib/parseBody.js");

// lib config
const {
    HTTP_STATUS, 
    JSON_HEADER,
    PATHS
} = require("../../lib/config.js");

// logger
const logger = require("../../logger/logger.js");

// PUT /notes
const putNotes = async (req, res) => {
    const {pathname} = parse(req.url, true);

    try {
        const id = Number(pathname.split('/')[2]);
        const notes = await parseNotes();
        const body = await parseBody(req);

        // check if note is exist with matching id
        const matchedNote = notes.find(note => note.id === id);
        if (!matchedNote) {
            res.writeHead(HTTP_STATUS.NOT_FOUND, JSON_HEADER);
            await logger(`PUT /notes - Note not found.: "${body.title}"`);

            return res.end(JSON.stringify({error: "Note not found."}, null, 2))
        }
        
        // update note
        matchedNote.title = body.title || matchedNote.title;
        matchedNote.body = body.body || matchedNote.body;

        // success response with log and updated notes
        res.writeHead(HTTP_STATUS.OK, JSON_HEADER);
        await fs.writeFile(PATHS.noteFile, JSON.stringify(notes, null, 2));
        await logger(`PUT /notes - Updated note: "${body.title}"`);

        return res.end(JSON.stringify(matchedNote, null, 2));

    } catch (error) {
        res.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON_HEADER);
        await logger(`PUT /notes - Error: ${error.message}`);

        return res.end(JSON.stringify({error_PUT: `${error.message}`}, null, 2));
    }
};

module.exports = putNotes;