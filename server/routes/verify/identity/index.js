const express = require("express");
const router = express.Router();
const stripeVerification = require("../../../modules/verification/stripe");
const authService = require("../../../modules/authentication/");

router.post('/create', (req, res) => {
    try {
        stripeVerification.uploadFile(req.body.userId);
        res.status(200).send({message: "Document uploaded for verification."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

router.get('/check', authService.requireAuthentication, (req, res) => {
    try {
        stripeVerification.updateAccount(req.body.userId);
        res.status(200).send({message: "Identity verified for user."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

module.exports = router;
