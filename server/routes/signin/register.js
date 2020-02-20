const express = require("express");
const router = express.Router();
const users = require("../../modules/authentication/user-agent");
const auth = require("../../modules/authentication/check-auth");
const owasp = require("owasp-password-strength-test");

/**
 * Old version of the registration flow
 * @deprecated OLD VERSION
 */

owasp.config({
    allowPassphrases: true,
    maxLength: 128,
    minLength: 8,
    minPhraseLength: 20,
    minOptionalTestsToPass: 4,
});

router.get("/", auth.checkNotAuthenticated, (req, res) => {
    res.render("register.ejs");
});

router.post("/", auth.checkNotAuthenticated, async (req, res) => {
    const passStrengthTest = owasp.test(req.body.password);
    if (passStrengthTest.strong || process.env.ANY_PASSWORD === "SKIP_CHECKS") {
        try {
            users.register(req);
            res.status(200).send({message: "Successful registration."});
        } catch (e) {
            res.status(400).send({message: e.message});
        }
    } else {
        res.status(400).send({message: passStrengthTest.errors});
    }
});

// module.exports = router;
