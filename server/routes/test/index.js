const express = require("express");
const router = express.Router();
const authAgent = require("../../modules/authentication/auth-agent");

router.get("/reqauth", authAgent.requireAuthentication, async (req, res) => {
    res.status(200).send({
        message: "Successfully authenticated and had correct permissions to access route.",
    });
});

router.post("/reqauth", authAgent.requireAuthentication, async (req, res) => {
    res.status(200).send({
        message: "Successfully authenticated and had correct permissions to access route.",
    });
});

module.exports = router;
