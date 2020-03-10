const express = require("express");
const router = express.Router();
const emailVerification = require("../../modules/verification/email");


router.post('/', async (req, res) => {
    try {
        const verificationResult = await emailVerification.isValidToken(req.body.data.email, req.body.data.email);
        if (verificationResult.isValidToken) {
            res.status(500).send({
                message: "Email successfully verified. Go to registration screen.",
            });
        } else {
            res.status(400).send({
                message: verificationResult.error,
            });
        }
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
});

module.exports = router;
