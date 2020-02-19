const express = require("express");
const router = express.Router();
const stripeVerification = require("../../verification/stripe");
const auth = require("../../authentication/check-auth");

router.post('/create', (req, res) => {
    try {
        stripeVerification.uploadFile(req.user.id);
        res.status(200).send({message: "Document uploaded for verification."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

router.get('/check', auth.checkAuthenticated, (req, res) => {
    try {
        stripeVerification.updateAccount(req.user.id);
        res.status(200).send({message: "Identity verified for user {" + req.user.id +"}."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

module.exports = router;
