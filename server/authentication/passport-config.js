const passport = require("passport");
const userAgent = require("./user-agent");
const initialiseLocal = require("./passport-local");
initialiseLocal(
  passport,
  email => userAgent.findByEmail(email),
  id => userAgent.findById(id)
);
require("./passport-google")(passport);
require("./passport-facebook")(passport);
require("./passport-linkedin")(passport);