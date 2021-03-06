/**
 * @module Verify-Email
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const emailVerification = require("../../../modules/verification/email");
const authService = require("../../../modules/authentication/");
const httpUtil = require("../../../util/http");

/**
 * This is the second step of the signup flow.<br/>
 * The user only inputs their email verification token and a response
 * is generated based on the validity of the token. The token is valid
 * only for 15 minutes.
 <p><b>Route: </b>/verify/email (POST)</p>
 <p><b>Permissions: </b>require not auth</p>
 * @param {string} req.headers.authorization authToken
 * @param {string} req.body.data.email email address of the user
 * @param {string} req.body.data.token the user input email verification token
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "data": &#123;
            "email": "paul&#64;karma.com",
            "token": "123456",
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if user/request already authenticated, 400 - already auth<br/>
 * - email successfully verified, 200 - go to registration<br/>
 * - if email != exist in DB, 400 - no token/email found<br/>
 * - if token !== token in DB, 400 - invalid token
 * - if token expired, 400 - expired token
 * - server error, 500 - error message
 * @name Verify Email
 * @function
 */
router.post('/', authService.requireNoAuthentication, async (req, res) => {
    try {
        log.info("'%s': Starting email verification", req.body.data.email);
        const verificationResult = await emailVerification.verifyEmail(req.body.data.email, req.body.data.token);
        return httpUtil.sendResult(verificationResult, res);
    } catch (e) {
        log.info("'%s': Failed email verification: " + e, req.body.data.email);
        httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
