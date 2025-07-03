const parseNotes = require("../../lib/parseNotes.js");

// lib config
const {HTTP_STATUS, JSON_HEADER} = require("../../lib/config.js");

// logger
const logger = require("../../logger/logger.js");

// GET /notes
const getNotes = async (req, res) => {
    try {
        const notes = await parseNotes();

        // if notes empty
        if (notes.length <= 0) {
            res.writeHead(HTTP_STATUS.OK, JSON_HEADER);
            await logger(`GET /notes - No notes found`);
                
            return res.end(JSON.stringify({message: "Notes is empty."}, null, 2));
        }
            
        // success response with log and notes
        res.writeHead(HTTP_STATUS.OK, JSON_HEADER);
        await logger(`GET /notes - Returned ${notes.length} notes`);

        return res.end(JSON.stringify(notes, null, 2));
        
    } catch (error) {
        res.writeHead(HTTP_STATUS.INTERNAL_SERVER_ERROR, JSON_HEADER);
        await logger(`GET /notes - Error: "${error.message}"`);

        return res.end(JSON.stringify({error_GET: `${error.message}`}, null, 2));
    }
};

module.exports = getNotes;