const express = require("express");
const router = express.Router();
const auth = require("../modules/authentication/check-auth");

router.get("/", auth.checkAuthenticated, (req, res) => {
    res.status(200).send({
        message: "Welcome to the Karma app.",
    });
});

module.exports = router;
