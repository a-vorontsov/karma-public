const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", passport.authenticate("facebook"));

router.get(
    "/callback",
    passport.authenticate("facebook", {
        successRedirect: "/signin/oauth/facebook/success",
        failureRedirect: "/signin/oauth/facebook/fail",
    }),
);

router.get("/success", (req, res) => {
    res.status(200).send({message: "Successful authentication with Facebook"});
});

router.get("/fail", (req, res) => {
    res.status(400).send({message: "Failed to authenticate with Facebook"});
});

module.exports = router;
