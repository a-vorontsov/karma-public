const express = require("express");
const router = express.Router();
const userAgent = require("../../modules/authentication/user-agent");
const owasp = require("owasp-password-strength-test");

/**
 * This is the third step of the signup flow (after email
 * verification).
 * The user inputs their chosen username, password and
 * confirmPassword, and the server attempts to register the
 * user with the given credentials.
 * The HTTP request object must also contain the user's email
 * address for identification.
 * A HTTP response is generated based on the outcome of the
 * operation. It will contain the new user's id following a
 * successful registration.
 * @route {POST} /register/user
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @param {string} confirmPassword
 * @return {HTTP} one of the following HTTP responses
 * - if success, 200 - success, userId == new user's id
 * - if password != confirmPassword, 400 - passwords don't match
 * - if password is not strong enough, 400 - passStrengthTest errors
 * - if registration failed, 400 - error of operation
 *   (e.x. if email does not exist)
 */
router.post("/", async (req, res) => {
    const passStrengthTest = owasp.test(req.body.password);
    if (req.body.password !== req.body.confirmPassword) {
        res.status(400).send({
            message: "Passwords do not match.",
        });
    } else if (!passStrengthTest.strong && process.env.SKIP_PASSWORD_CHECKS != true) {
        res.status(400).send({
            message: "Weak password.",
            errors: passStrengthTest.errors,
        });
    } else {
        try {
            const userId = await userAgent.registerUser(req.body.email, req.body.username, req.body.password);
            res.status(200).send({
                message: "User registration successful. Goto individual/org registration selection",
                userId: userId,
            });
        } catch (e) {
            res.status(400).send({
                message: e.message,
            });
        }
    }
});

module.exports = router;
