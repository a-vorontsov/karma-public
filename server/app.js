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
app.use("/signin/password", require("./routes/signin/password"));
app.use("/signin/email", require("./routes/signin/email"));
app.use("/signin/forgot", require("./routes/signin/forgotPassword"));
app.use("/register/user", require("./routes/register/user"));
app.use("/register/individual", require("./routes/register/individual"));
app.use("/register/organisation", require("./routes/register/organisation"));
app.use("/logout", require("./routes/signin/logout"));

app.use("/verify/phone", require("./routes/verify/phone"));
app.use("/verify/identity", require("./routes/verify/identity"));

app.use("/users", require("./routes/users"));
app.use("/user", require("./routes/user"));
app.use("/causes", require("./routes/causes"));
app.use("/event", require("./routes/event/event"));
app.use("/profile/edit/password", require("./routes/profile/edit/change-password"));
app.use("/bugreport", require("./routes/bugreport"));
// import OAuth routes if applicable
if (process.env.ENABLE_OAUTH === "1") {
    app.use("signin/oauth/facebook", require("./routes/signin/OAuth/facebook"));
    app.use("signin/oauth/google", require("./routes/signin/OAuth/google"));
    app.use("signin/oauth/linkedin", require("./routes/signin/OAuth/linkedin"));
}

// Render and direct to view based on user auth status
app.all("*", auth.requireAuthentication);

module.exports = app;
