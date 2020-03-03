const express = require('express');
const router = express.Router();
const twilioVerification = require('../../modules/verification/twilio');

router.post('/create', (req, res) => {
    try {
        twilioVerification.startPhoneVerification(req.body.number)
            .then(verification => res.send(verification))
            .then(verification => console.log("Created phone verification ID " + verification.sid));
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

router.post('/check', (req, res) => {
    try {
        twilioVerification.checkPhoneVerification(req.body.number, req.body.code)
            .then(verification => res.send(verification))
            .then(verification => console.log("Checked phone verification ID " + verification.sid + " - status: " + verification.status));
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

module.exports = router;
