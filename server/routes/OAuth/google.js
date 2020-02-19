const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", passport.authenticate("google", {scope: ["profile"]}));

router.get(
    "/callback",
    passport.authenticate("google", {
        successRedirect: "/auth/google/success",
        failureRedirect: "/auth/google/fail",
    }),
);

router.get("/success", (req, res) => {
    res.status(200).send({message: "Successful authentication with Google"});
});

router.get("/fail", (req, res) => {
    res.status(400).send({message: "Failed to authenticate with Google"});
});

module.exports = router;
