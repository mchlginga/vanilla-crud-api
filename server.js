const http = require("http");
const {parse} = require("url");

const config = require("./config/index.js");
const handleNotes = require("./route/notes.js");
const {HTTP_STATUS, JSON_HEADER} = require("./lib/config.js");

const port = config.port;

// create server
const server = http.createServer (async (req, res) => {
    const {pathname} = parse(req.url, true);
    const method = req.method;

    // route
    if (pathname.startsWith("/notes")) {
        return handleNotes(req, res);
    } 

    res.writeHead(HTTP_STATUS.NOT_FOUND, JSON_HEADER);
    return res.end(JSON.stringify({error: "handleNotes not found."}, null, 2)); 
});

server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});