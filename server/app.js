require("dotenv").config();
const express = require("express");
const app = express();
const jose = require("./modules/jose");
jose.fetchBlacklist();
const authAgent = require("./modules/authentication/auth-agent");
const methodOverride = require("method-override");
const helmet = require("helmet");

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// -- MIDDLEWARE -- //
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

// -- ROUTES -- //
app.use("/signin/email", require("./routes/signin/email"));
app.use("/signin/password", require("./routes/signin/password"));
app.use("/signin/forgot", require("./routes/signin/forgot"));
app.use("/signin/reset", require("./routes/signin/reset"));

app.use("/signup/user", require("./routes/signup/user"));
app.use("/signup/individual", require("./routes/signup/individual"));
app.use("/signup/organisation", require("./routes/signup/organisation"));

app.use("/signout", require("./routes/signout"));

app.use("/verify/email", require("./routes/verify/email"));
app.use("/verify/phone", require("./routes/verify/phone"));
app.use("/verify/identity", require("./routes/verify/identity"));

app.use("/error", require("./routes/error"));
app.use("/bugreport", require("./routes/bugreport"));
app.use("/notification", require("./routes/notification"));
app.use("/information", require("./routes/information"));

app.use("/causes", require("./routes/causes"));
app.use("/causes/select", require("./routes/causes/select"));

app.use("/event", require("./routes/event"));
// TODO: discuss structure

app.use("/profile/edit", require("./routes/profile/edit"));
app.use("/profile/edit/password", require("./routes/profile/edit/password"));
app.use("/profile", require("./routes/profile"));

app.use("/admin", require("./routes/admin"));

// import OAuth routes and dependencies if applicable
if (process.env.ENABLE_OAUTH === 1) {
    const passport = require("passport");
    require("./modules/authentication/passport-config");
    app.use(passport.initialize());
    app.use("signin/oauth/facebook", require("./routes/signin/OAuth/facebook"));
    app.use("signin/oauth/google", require("./routes/signin/OAuth/google"));
    app.use("signin/oauth/linkedin", require("./routes/signin/OAuth/linkedin"));
}

// TODO: regex that excludes only requireNotAuth routes
app.all("*", authAgent.requireAuthentication);

module.exports = app;
