const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const {parse} = require("url");

const config = require("./config/index.js");

const noteFile = path.join(__dirname, "notes", "notes.json");
const port = config.port;

const ensureNoteFile = async () => {
    try {
        await fs.access(noteFile);
    } catch (error) {
        await fs.mkdir(path.dirname(noteFile), {recursive: true});
        await fs.writeFile(noteFile, "[]");
    }
};

// parse json body from post
const parseBody = async (req) => {
    return new Promise ((resolve, reject) => {
        let data = "";
        req.on("data", chunk => data += chunk);

        req.on ("end", () => {
            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
};

const newTitle = (t) => {
    try {
        return t.trim().toLowerCase().replace(/\s+/g, '-');
    } catch (error) {
        console.log("Error creating new title:", error.message);
    }
};

// create server
const server = http.createServer (async (req, res) => {
    try {
        await ensureNoteFile();
        const {pathname} = parse(req.url, true);
        const method = req.method;

        // GET /notes
        if (method === "GET" && pathname === "/notes") {
            try {
                const notes = JSON.parse(await fs.readFile(noteFile, "utf-8"));
                res.writeHead (200, {"Content-Type": "application/json"});

                return res.end(JSON.stringify(notes, null, 2));
            } catch (error) {
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end("Failed to read notes.");
            }
        }

        // POST /notes
        if (method === "POST" && pathname === "/notes") {
            try {
                const body = await parseBody(req);
                const notes = JSON.parse(await fs.readFile(noteFile, "utf-8"));

                // check if the note is already exist
                const exist = notes.find(note => newTitle(note.title) === newTitle(body.title));
                if (exist){
                    res.writeHead(409, {"Content-Type": "application/json"});
                    return res.end("Note is already exist.")
                }

                const newNote = {
                    id: Date.now(),
                    title: body.title,
                    body: body.body
                };

                notes.push(newNote);
                await fs.writeFile(noteFile, JSON.stringify(notes, null, 2));

                res.writeHead(201, {"Content-Type": "application/json"});
                return res.end (JSON.stringify(newNote, null, 2));
            } catch (error) {
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end("Failed to create note.");
            }
        }
    } catch (error) {
        console.log("Error starting server:", error.message);
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});