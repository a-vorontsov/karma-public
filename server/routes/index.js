const express = require("express");
const router = express.Router();
const authAgent = require("../modules/authentication/auth-agent");

router.get("/", authAgent.checkAuthenticated, (req, res) => {
    res.status(200).send({
        message: "Welcome to the Karma app.",
    });
});

module.exports = router;
