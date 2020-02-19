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
const passport = require("passport");
require("./authentication/passport-config");

// @temporary Set view engine (for demoing views)
app.set("view-engine", "ejs");

// -- MIDDLEWARE -- //
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(flash());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

// -- ROUTES -- //
app.use("/", require("./routes/index"));
app.use("/login", require("./routes/login"));
app.use("/login/forgot", require("./routes/forgotPassword"));
app.use("/verify/phone", require("./routes/verify/phone"));
app.use("/verify/identity", require("./routes/verify/identity"));
app.use("/register", require("./routes/register"));
app.use("/logout", require("./routes/logout"));
app.use("/users", require("./routes/users"));
app.use("/events", require("./routes/event"));
app.use("/edit/password", require("./routes/change-password"));
if (process.env.ENABLE_OAUTH === "1") {
    app.use("/auth/facebook", require("./routes/auth/facebook"));
    app.use("/auth/google", require("./routes/auth/google"));
    app.use("/auth/linkedin", require("./routes/auth/linkedin"));
}

// Connect to DB
// TODO:

// Render and direct to view based on user auth status
app.all("*", auth.requireAuthentication);

module.exports = app;
