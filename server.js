const http = require("http");
const {parse} = require("url");

const config = require("./config/index.js");
const handleNotes = require("./routes/notes.js");

const port = config.port;

// create server
const server = http.createServer (async (req, res) => {
    const {pathname} = parse(req.url, true);
    const method = req.method;

    // route
    if (pathname.startsWith("/notes")) {
        return handleNotes(req, res);
    }

    res.writeHead(404, {"Content-Type": "application/json"});
    res.end(JSON.stringify({message: "Route not found."}));
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});