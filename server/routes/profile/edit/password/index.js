/**
 * @module Profile-Edit-Password
 */
const log = require("../../../../util/log");
const express = require("express");
const router = express.Router();
const userAgent = require("../../../../modules/user");
const authService = require("../../../../modules/authentication/");
const owasp = require("owasp-password-strength-test");

/**
 * Attempt to change the password for a given user.
 * Requires the user to input their old and a strong-enough
 * new password (and a confirmPassword).
 <p><b>Route: </b>/profile/edit/password (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {string} oldPassword
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if confirm password mismatch, 400 - passwords don't match<br/>
 * - if password is not strong enough, 400 - passStrengthTest errors<br/>
 * - if oldPassword != user's password, 400 - incorrect old password<br/>
 * - if success, 200 - successfully updated<br/>
 * - if error with operation, 500 - error message<br/>
 * Here is an example of a response with custom errors:
 <pre><code>
    &#123;
        "message": "Weak password.",
        "errors:" &#123;
            [
                "The password must be at least 10 characters long.",
                "The password must contain at least one uppercase letter.",
                "The password must contain at least one number.",
                "The password must contain at least one special character.",
            ],
        &#125;
    &#125;
</code></pre>
 * @name Edit password
 * @function
 */
router.post("/", authService.requireAuthentication, async (req, res) => {
    const passStrengthTest = owasp.test(req.body.newPassword);
    log.info("User id '%d': Updating password", req.body.userId);
    if (req.body.newPassword !== req.body.confirmPassword) {
        log.warn("User id '%d': Updating password failed: New/confirmed password fields do not match", req.body.userId);
        res.status(400).send({
            message: "Passwords do not match.",
        });
    } else if (!passStrengthTest.strong && process.env.SKIP_PASSWORD_CHECKS != true) {
        log.warn("User id '%d': Updating password failed: New password too weak", req.body.userId);
        res.status(400).send({
            message: "Weak password.",
            errors: passStrengthTest.errors,
        });
    } else {
        try {
            if (await userAgent.isCorrectPasswordById(req.body.userId, req.body.oldPassword)) {
                await userAgent.updatePassword(
                    req.body.userId,
                    req.body.newPassword,
                );
                log.info("User id '%d': Updating password successful", req.body.userId);
                res.status(200).send({
                    message: "Password successfully updated.",
                });
            } else {
                log.warn("User id '%d': Updating password failed: Old/new password fields do not match", req.body.userId);
                res.status(400).send({
                    message: "Incorrect old password.",
                });
            }
        } catch (e) {
            log.error("User id '%d': Failed updating password: " + e, req.body.userId);
            res.status(500).send({
                message: e.message,
            });
        }
    }
});

module.exports = router;
