const path = require("path");
const fs = require("fs/promises");
const {parse} = require("url");

const parseBody = require("../lib/parseBody.js");
const logger = require("../logger/logger.js");

const noteFile = path.join(__dirname, "..", "notes", "notes.json");

// ensure file "notes.json" exist
const ensureNoteFile = async () => {
    try {
        await fs.access(noteFile);
    } catch (error) {
        await fs.mkdir(path.dirname(noteFile), {recursive: true});
        await fs.writeFile(noteFile, "[]");
    }
};

// this makes the title case sensitive
const normalizeTitle = (t) => {
    try {
        return t.trim().toLowerCase().replace(/\s+/g, '-');
    } catch (error) {
        console.log("Error creating new title:", error.message);
    }
};

// pasrse notes.json
const parseNotes = async () => {
    try {
        return JSON.parse(await fs.readFile(noteFile, "utf-8"));
    } catch (error) {
        console.log("Error parsing note file:", error.message);
        return [];
    }
};

const handleNotes = async (req, res) => {
    await ensureNoteFile();
    const {pathname} = parse(req.url, true);
    const method = req.method;
    
    // GET /notes
    if (method === "GET" && pathname === "/notes") {
        try {
            const notes = await parseNotes();

            // check if there is a note
            if (notes.length <= 0) {
                res.writeHead(200, {"Content-Type": "application/json"});
                await logger(`GET /notes - No notes found`);

                return res.end(JSON.stringify({message: "No notes found."}));
            }

            // success response with all notes
            res.writeHead (200, {"Content-Type": "application/json"});
            await logger(`GET /notes - Returned ${notes.length} notes`);

            return res.end(JSON.stringify(notes, null, 2));
        } catch (error) {
            res.writeHead(500, {"Content-Type": "application/json"});
            await logger(`GET /notes - Error: ${error.message}`);

            return res.end(JSON.stringify({error: `${error.message}`}));
        }
    }

    // POST /notes
    if (method === "POST" && pathname === "/notes") {
        try {
            const body = await parseBody(req);
            const notes = await parseNotes();

            // check if note with same title already exists
            const exist = notes.find(note => normalizeTitle(note.title) === normalizeTitle(body.title));
            if (exist){
                res.writeHead(409, {"Content-Type": "application/json"});
                await logger(`POST /notes - Note already exists: "${body.title}"`);

                return res.end(JSON.stringify({error: "Note is already exist."}));
            }

            // create new note
            const newNote = {
                id: Date.now(),
                title: body.title,
                body: body.body
            };
            notes.push(newNote);
            await fs.writeFile(noteFile, JSON.stringify(notes, null, 2));

            // success response with created note
            res.writeHead(201, {"Content-Type": "application/json"});
            await logger(`POST /notes - Created note: "${body.title}"`);

            return res.end (JSON.stringify(newNote, null, 2));
        } catch (error) {
            res.writeHead(500, {"Content-Type": "application/json"});
            await logger(`POST /notes - Error: ${error.message}`);

            return res.end(JSON.stringify({error: `${error.message}`}));
        }
    }

    // PUT /notes
    if (method === "PUT" && pathname.startsWith("/notes/")) {
        try {
            const id = Number(pathname.split('/')[2]);
            const body = await parseBody(req);
            const notes = await parseNotes();

            // check note with matching id
            const matchedNote = notes.find(note => note.id === id);
            if (!matchedNote) {
                res.writeHead(200, {"Content-Type": "application/json"});
                await logger(`PUT /notes - Note not found.: "${body.title}"`);

                return res.end(JSON.stringify({message: "Note not found."}))
            }

            // update notes
            matchedNote.title = body.title || matchedNote.title;
            matchedNote.body = body.body || matchedNote.body;
            await fs.writeFile(noteFile, JSON.stringify(notes, null, 2));

            // success response with updated note
            res.writeHead(200, {"Content-Type": "application/json"});  
            await logger(`PUT /notes - Update note: "${body.title}"`);

            return res.end(JSON.stringify(matchedNote, null, 2));

        } catch (error) {
            res.writeHead(500, {"Content-Type": "application/json"});
            await logger(`PUT /notes - Error: ${error.message}`);

            return res.end(JSON.stringify({error: `${error.message}`}));
        }
    }

    // DELETE /notes
    if (method === "DELETE" && pathname.startsWith("/notes/")) {
        try {
            const id = Number(pathname.split('/')[2]);
            const notes = await parseNotes();

            // delete note with matching id
            const filtered = notes.filter(note => note.id !== id);
            if (filtered.length === notes.length) {
                res.writeHead(404, {"Content-Type": "application/json"});
                await logger(`DELETE /notes/${id} - Note not found`);

                return res.end(JSON.stringify({message: "Note not found"}));
            }

            // write updated notes
            await fs.writeFile(noteFile, JSON.stringify(filtered, null, 2));

            // success response with updated notes
            res.writeHead(200, {"Content-Type": "application/json"});
            await logger(`DELETE /notes/${id} - Successfully deleted note`);

            res.end(JSON.stringify({message: "Note is susscefully deleted."}));
        } catch (error) {
            res.writeHead(500, {"Content-Type": "application/json"});
            await logger(`DELETE /notes - Error: ${error.message}`);

            return res.end(JSON.stringify({error: `${error.message}`}));
        }
    }
};

module.exports = handleNotes;