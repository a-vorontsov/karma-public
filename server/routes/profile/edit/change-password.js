/**
 * @module Change-password
 */

const express = require("express");
const router = express.Router();
const userAgent = require("../../../modules/authentication/user-agent");
const auth = require("../../../modules/authentication/check-auth");
const owasp = require("owasp-password-strength-test");

/**
 * Attempt to change the password for a given user.
 * Requires the user to input their old and a strong-enough
 * new password (and a confirmPassword).
 * @route {POST} /profile/edit/password
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {string} oldPassword
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @return {HTTP} one of the following HTTP responses
 * - if confirm password mismatch, 400 - passwords don't match
 * - if password is not strong enough, 400 - passStrengthTest errors
 * - if oldPassword != user's password, 400 - incorrect old password
 * - if success, 200 - successfully updated
 * @function
 */
router.post("/", auth.checkAuthenticated, async (req, res) => {
    const passStrengthTest = owasp.test(req.body.newPassword);
    if (req.body.newPassword !== req.body.confirmPassword) {
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
            if (await userAgent.isCorrectPassword(req.body.userId, req.body.oldPassword)) {
                await userAgent.updatePassword(
                    req.body.userId,
                    req.body.newPassword,
                );
                res.status(200).send({
                    message: "Password successfully updated.",
                });
            } else {
                res.status(400).send({
                    message: "Incorrect old password.",
                });
            }
        } catch (e) {
            res.status(400).send({
                message: e.message,
            });
        }
    }
});

module.exports = router;
