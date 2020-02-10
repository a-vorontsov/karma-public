const express = require('express');
const router = express.Router();
const twilioVerification = require('../verification');


router.post('/phone/create', (req, res) => {
    twilioVerification.startPhoneVerification(req.body.number)
        .then(verification => res.send(verification))
        .then(verification => console.log("Created phone verification ID " + verification.sid));
});

router.post('/phone/check', (req, res) => {
    twilioVerification.checkPhoneVerification(req.body.number, req.body.code)
        .then(verification => res.send(verification))
        .then(verification => console.log("Checked phone verification ID " + verification.sid + " - status: " + verification.status));
});

module.exports = router;
