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
const passport = require("passport");
const auth = require("./authentication/auth");
const userAgent = require("./authentication/user-agent");
const methodOverride = require("method-override");
const PORT = process.env.PORT || 8000;

// -- Passport config -- //
const initialisePassport = require("./authentication/passport-config");
initialisePassport(
  passport,
  email => userAgent.findByEmail(email),
  id => userAgent.findById(id)
);

// @temporary Set view engine (for demoing views)
app.set("view-engine", "ejs");

// -- MIDDLEWARE -- //
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

// Connect to DB
// TODO:

// Render and direct to view based on user auth status
app.all("*", auth.requireAuthentication);

app.listen(PORT, console.log(`Listening on port ${PORT} ...`));
