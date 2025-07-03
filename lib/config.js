const path = require("path");

// configs
const PATHS = {
    noteFile: path.join(__dirname, "..", "notes", "notes.json")
};

const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

const JSON_HEADER = {
    "Content-Type": "application/json"
};

module.exports = {
    PATHS,
    HTTP_STATUS,
    JSON_HEADER
};