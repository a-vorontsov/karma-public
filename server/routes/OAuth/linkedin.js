const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", passport.authenticate("linkedin"));

router.get(
    "/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/linkedin/success",
        failureRedirect: "/auth/linkedin/fail",
    }),
);

router.get("/success", (req, res) => {
    res.status(200).send({message: "Successful authentication with Linkedin"});
});

router.get("/fail", (req, res) => {
    res.status(400).send({message: "Failed to authenticate with Linkedin"});
});

module.exports = router;
