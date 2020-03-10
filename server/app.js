require("dotenv").config();
const express = require("express");
const app = express();
const authAgent = require("./modules/authentication/auth-agent");
const methodOverride = require("method-override");
const helmet = require("helmet");

// -- MIDDLEWARE -- //
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(methodOverride("_method"));

// -- ROUTES -- //
app.use("/signin/password", require("./routes/signin/password"));
app.use("/signin/email", require("./routes/signin/email"));
app.use("/signin/forgot", require("./routes/signin/forgotPassword"));
app.use("/register/user", require("./routes/register/user"));
app.use("/register/individual", require("./routes/register/individual"));
app.use("/register/organisation", require("./routes/register/organisation"));
app.use("/logout", require("./routes/signin/logout"));

app.use("/verify/email", require("./routes/verify/email"));
app.use("/verify/phone", require("./routes/verify/phone"));
app.use("/verify/identity", require("./routes/verify/identity"));

app.use("/error/nouserid", require("./routes/error/noUserId"));
app.use("/error/noauthtoken", require("./routes/error/noAuthToken"));
app.use("/error/unauthorised", require("./routes/error/unauthorised"));
app.use("/error/alreadyauthenticated", require("./routes/error/alreadyAuthenticated"));
app.use("/error/customerror", require("./routes/error/customError"));
app.use("/error/usernotfound", require("./routes/error/userNotFound"));

app.use("/notification", require("./routes/notification"));

app.use("/user", require("./routes/user"));
app.use("/causes", require("./routes/causes"));
app.use("/event", require("./routes/event/event"));
app.use("/profile/view", require("./routes/profile/view"));
app.use("/profile/edit/password", require("./routes/profile/edit/change-password"));
app.use("/bugreport", require("./routes/bugreport"));

// import OAuth routes and dependencies if applicable
if (process.env.ENABLE_OAUTH === "1") {
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
