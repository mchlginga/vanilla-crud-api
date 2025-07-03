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

const logger = require("../../logger/logger.js");

const deleteNote = async (req, res) => {
    const {pathname} = parse(req.url, true);

    try {
        const id = Number(pathname.split('/')[2]);
        const notes = await parseNotes();

        // delete note with matching id
        const filter = notes.filter(note => note.id !== id);
        if (filter.length === notes.length) {
            res.writeHead(HTTP_STATUS.OK, JSON_HEADER);
            await logger(`DELETE /notes/${id} - Note not found`);

            return req.end(JSON.stringify({message: "Note not found."}, null, 2));
        }

        // updated notes
        await fs.writeFile(PATHS.noteFile, JSON.stringify(filter, null, 2));

        // success response with log and updated note
        res.writeHead(HTTP_STATUS.OK, JSON_HEADER);
        await logger(`DELETE /notes/${id} - Successfully deleted note`);
        
        return res.end(JSON.stringify({message: `${id} is successfully delete.`}));

    } catch (error) {
        res.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON_HEADER);
        await logger(`DELETE /notes - Error: ${error.message}`);

        return res.end(JSON.stringify({error_DELETE: `${error.message}`}, null, 2));
    }
};

module.exports = deleteNote;