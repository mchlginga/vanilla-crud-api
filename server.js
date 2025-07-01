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
                return res.end(JSON.stringify({error: "Failed to read notes."}));
            }
        }
    } catch (error) {
        res.end("Error creating a server:", error.message);
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});