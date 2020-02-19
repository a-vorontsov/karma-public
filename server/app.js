require("dotenv").config();
const express = require("express");
const app = express();
const flash = require("express-flash");
const session = require("express-session");
const auth = require("./modules/authentication/check-auth");
const methodOverride = require("method-override");
const helmet = require("helmet");
const passport = require("passport");
require("./modules/authentication/passport-config");

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
app.use("/login", require("./routes/login/login"));
app.use("/login/forgot", require("./routes/login/forgotPassword"));
app.use("/register", require("./routes/login/register"));
app.use("/logout", require("./routes/login/logout"));

app.use("/verify/phone", require("./routes/verify/phone"));
app.use("/verify/identity", require("./routes/verify/identity"));

app.use("/users", require("./routes/users"));
app.use("/events", require("./routes/event/event"));
app.use("/profile/edit/password", require("./routes/profile/edit/change-password"));
app.use("/bugreport", require("./routes/bugreport"));
// import OAuth routes if applicable
if (process.env.ENABLE_OAUTH === "1") {
    app.use("/auth/facebook", require("./routes/OAuth/facebook"));
    app.use("/auth/google", require("./routes/OAuth/google"));
    app.use("/auth/linkedin", require("./routes/OAuth/linkedin"));
}

// Render and direct to view based on user auth status
app.all("*", auth.requireAuthentication);

module.exports = app;
