const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../../modules/authentication/check-auth");

router.get("/", auth.checkNotAuthenticated, (req, res) => {
    res.render("login.ejs");
});

router.post(
    "/",
    auth.checkNotAuthenticated,
    passport.authenticate("local", {
        successRedirect: "/login/success",
        failureRedirect: "/login/fail",
        failureFlash: false,
    }),
);

router.get("/success", (req, res) => {
    res.status(200).send({message: "Successful authentication with username & password."});
});

router.get("/fail", (req, res) => {
    res.status(400).send({message: "Invalid username or password."});
});

module.exports = router;
