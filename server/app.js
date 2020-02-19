/**
 * If in development, import the local environment
 * configuration file.
 */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const auth = require("./authentication/check-auth");
const methodOverride = require("method-override");
const helmet = require("helmet");
const PORT = process.env.PORT || 8000;
const passport = require("passport");
require("./authentication/passport-config");

// @temporary Set view engine (for demoing views)
app.set("view-engine", "ejs");

// -- MIDDLEWARE -- //
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// -- ROUTES -- //
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/register"));
app.use("/logout", require("./routes/logout"));
app.use("/users", require("./routes/users"));
app.use("/edit/password", require("./routes/change-password"));
if (process.env.ENABLE_OAUTH === "1") {
  app.use("/auth/facebook", require("./routes/facebook"));
  app.use("/auth/google", require("./routes/google"));
  app.use("/auth/linkedin", require("./routes/linkedin"));
}
// Connect to DB
// TODO:

const jw = require("./token/jwt-agent");
var token = jw.signWithDefaultOptions({
  email: "john@doe.com",
  admin: false,
  at_hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
});
console.log(token);

var token2 = jw.signWithMinimalOptions({
  email: "john@doe.com",
  admin: false,
  at_hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8"
});

// console.log(jw.verifyWithDefaultOptions(token));
console.log(jw.verifyWithMinimalOptions(token2));

// Render and direct to view based on user auth status
app.all("*", auth.requireAuthentication);

app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
