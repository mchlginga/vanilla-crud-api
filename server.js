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

const server = http.createServer (async (req, res) => {
    try {
        await ensureNoteFile();
        const {pathname} = parse(req.url, true);
        const method = url.method;

        // GET /notes
        if (method === "GET" && pathname === "/notes") {
            const notes = JSON.parse(await fs.readFile(noteFile, "utf-8"));

            res.writeHead(200, {"Content:Type": "application/json"});
            return res.end(JSON.stringify(notes));
        }
    } catch (error) {
        console.log("Error creating a server:", error.message);
    }
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});