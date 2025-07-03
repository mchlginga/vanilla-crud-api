const {parse} = require("url");

// lib
const ensureNoteFile = require("../lib/ensureNoteFile.js");
const {HTTP_STATUS, JSON_HEADER} = require("../lib/config.js");

// route /notes
const {
    getNotes,
    postNotes,
    putNotes,
    deleteNote
} = require("./notes/index.js");

// handles /notes endpoints (GET, POST, PUT, DELETE)
const handleNotes = async (req, res) => {
    await ensureNoteFile();
    const {pathname} = parse(req.url, true);
    const method = req.method;

    // GET /notes
    if (method === "GET" && pathname === "/notes") {
        return await getNotes(req, res);
    }

    // POST /notes
    if (method === "POST" && pathname === "/notes") {
        return await postNotes(req, res);
    }

    if (method === "PUT" && pathname.startsWith("/notes/")){
        return await putNotes(req, res);
    }

    if (method === "DELETE" && pathname.startsWith("/notes/")){
        return await deleteNote(req, res);
    }

    res.writeHead(HTTP_STATUS.NOT_FOUND, JSON_HEADER);
    await logger(`Route not found`);

    res.end(JSON.stringify({error: "Route not found"}, null, 2));
};

module.exports = handleNotes;