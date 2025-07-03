const fs = require("fs/promises");

// lib
const parseNotes = require("../../lib/parseNotes.js");
const parseBody = require("../../lib/parseBody.js");
const normalizeTitle = require("../../lib/normalizeTitle.js");

// lib, config
const {
    HTTP_STATUS, 
    JSON_HEADER, 
    PATHS
} = require("../../lib/config.js");

// logger
const logger = require("../../logger/logger.js");

const postNotes = async (req, res) => {
    try {
        const notes = await parseNotes();
        const body = await parseBody(req);

         // check if the title is already exist
        const exist = notes.find(note => normalizeTitle(note.title) === normalizeTitle(body.title));
        if (exist) {
            res.writeHead(HTTP_STATUS.OK, JSON_HEADER);
            await logger(`POST /notes - Note already exists: "${body.title}"`);

            return res.end(JSON.stringify({message: `Title is already exists.`}, null, 2));
        }

        // create new note
        const newNote = {
            id: Date.now(),
            title: body.title,
            body: body.body
        };

        notes.push(newNote);
        await fs.writeFile(PATHS.noteFile, JSON.stringify(notes, null, 2));

        // success response with log and created note
        res.writeHead(HTTP_STATUS.CREATED, JSON_HEADER);
        await logger(`POST /notes - Created note: "${body.title}"`);

        return res.end(JSON.stringify(newNote, null, 2));
        
    } catch (error) {
        res.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON_HEADER);
        await logger(`POST /notes - Error: "${error.message}"`);
            
        return res.end(JSON.stringify({error_POST: `${error.message}`}, null, 2));
    }
};

module.exports = postNotes;