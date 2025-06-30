require("dotenv").config();

const dev = require("./dev.js");
const prod = require("./prod.js");

const env = process.env.NODE_ENV || "development";

const config = env === "development" ? dev : prod;

module.exports = config;