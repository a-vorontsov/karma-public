require("dotenv").config();
process.env.environment = 'testing';
require("../util/log");
require('twilio');
const db = require("../database/connection");

jest.mock("twilio", () => jest.fn()); // prevent actual initalization of Twilio client in tests

afterAll(() => { // close database pool after finishing test suite
    return db.end();
});
