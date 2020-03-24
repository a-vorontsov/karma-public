/**
 * @module Sign-in-Reset
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const userAgent = require("../../../modules/user");
const authService = require("../../../modules/authentication/");
const owasp = require("owasp-password-strength-test");
const httpUtil = require("../../../util/httpUtil");

/**
 * Attempt to reset the password for a given user.<br/>
 * This route <span class="highlight">may only be visited</span> after having input
 * a correct password reset token (received by email).<br/>
 * The data in the request body only needs to specify
 * the new password for the user. The user's details
 * are derived from the authorisation token.<br/>
 * This operation should only fail if attempted by an
 * unauthenticated and/or unauthorised user, or if
 * the input password is not strong enough.
 <p><b>Route: </b>/reset (POST)</p>
 <p><b>Permissions: </b>require pass-reset permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {string} req.body.data.password new password input by user
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "data": &#123;
            "password": "securePass123!",
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if attempted any time other than after a valid pass reset token, 403 - forbidden<br/>
 * - if password is not strong enough, 400 - passStrengthTest errors<br/>
 * - if success, 200 - successfully updated, go to sign-in<br/>
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
 * @name Reset password
 * @function
 */
router.post("/", authService.requireAuthentication, async (req, res) => {
    log.info("Resetting password");
    const passStrengthTest = owasp.test(req.body.data.password);
    if (!passStrengthTest.strong && process.env.SKIP_PASSWORD_CHECKS != true) {
        return res.status(400).send({
            message: "Weak password.",
            errors: passStrengthTest.errors,
        });
    }
    try {
        await userAgent.updatePassword(
            req.body.userId,
            req.body.data.password,
        );
        httpUtil.sendResult({
            status: 200,
            message: "Password successfully updated. Go to sign-in screen.",
        }, res);
    } catch (e) {
        log.error("Resetting password failed: " + e);
        httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
