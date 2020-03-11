/**
 * @module Verify-Email
 */

const express = require("express");
const router = express.Router();
const emailVerification = require("../../../modules/verification/email");
const authAgent = require("../../../modules/authentication/auth-agent");

/**
 * This is the second step of the signup flow.<br/>
 * The user only inputs their email verification token and a response
 * is generated based on the validity of the token. The token is valid
 * only for 15 minutes.
 * @route {POST} /verify/email
 * @param {number} req.body.userId since no userId yet, null here
 * @param {string} req.body.authToken since no authToken yet, null here
 * @param {string} req.body.data.email email address of the user
 * @param {string} req.body.data.token the user input email verification token
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "userId": null,
        "authToken": null,
        "data": &#123;
            "email": "paul&#64;karma.com",
            "token": "123456",
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if user/request already authenticated, 400 - already auth<br/>
 * - email successfully verified, 200 - goto registration<br/>
 * - if email != exist in DB, 400 - no token/email found<br/>
 * - if token !== token in DB, 400 - invalid token
 * - if token expired, 400 - expired token
 * - server error, 500 - error message
 * @name Verify Email
 * @function
 */
router.post('/', authAgent.requireNoAuthentication, async (req, res) => {
    try {
        const verificationResult = await emailVerification.isValidToken(req.body.data.email, req.body.data.token);
        if (verificationResult.isValidToken) {
            res.status(200).send({
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
