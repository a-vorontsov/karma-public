require("dotenv").config();
const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern', pattern: '%[ %d %p %f{2}:%l%]: %m',
            },
        },
    },
    categories: {
        default: {appenders: ['out'], level: 'info', enableCallStack: true},
    },
});

const log = log4js.getLogger();

log.level = process.env.NODE_ENV === "development" ? "debug" : "info";
switch (process.env.NODE_ENV) {
    case "development":
        log.level = "debug";
        break;
    case "testing":
        log.level = "debug";
        break;
    default:
        log.level = "info";
}

if (process.env.CI) {
    log.level = "off";
}

log.info("Logging at level: %s", log.level);

module.exports = log;
