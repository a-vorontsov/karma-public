require("dotenv").config();
const log4js = require('log4js');
const log = log4js.getLogger();

log.level = process.env.NODE_ENV === "development" ? "debug" : "info";
log.info("Logging at level: %s", log.level);

module.exports = log;
