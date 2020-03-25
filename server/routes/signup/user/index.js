/**
 * @module Sign-up-User
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const userAgent = require("../../../modules/user");
const authService = require("../../../modules/authentication");
const owasp = require("owasp-password-strength-test");
const httpUtil = require("../../../util/http");

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
 <p><b>Route: </b>/signup/user (POST)</p>
 <p><b>Permissions: </b>require not auth</p>
 * @param {string} req.headers.authorization authToken (can be null at this stage)
 * @param {object} req.body.data.user the user input values for their user account
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "data": &#123;
            "user": &#123;
                "email": "paul&#64;karma.com",
                "username": "Paul",
                "password": "securePass123!",
            &#125;
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if success, 200 - success, userId == new user's id<br/>
 * - if password != confirmPassword, 400 - passwords don't match<br/>
 * - if password is not strong enough, 400 - passStrengthTest errors<br/>
 * - if registration failed, 400 - error of operation<br/>
 *   (e.x. if email does not exist)
 * Here is an example return object on success:
<pre><code>
    &#123;
        "userId": 123,
        "authToken": "secureAuthTokenForUser123",
        "message": "User registration successful. Go to individual/org registration selection",
    &#125;
</code></pre>
 * @name Sign-up User
 * @function
 */
router.post("/", authService.requireNoAuthentication, async (req, res) => {
    log.info("Signing up user");
    const passStrengthTest = owasp.test(req.body.data.user.password);
    if (!passStrengthTest.strong && process.env.SKIP_PASSWORD_CHECKS != true) {
        res.status(400).send({
            message: "Weak password.",
            errors: passStrengthTest.errors,
        });
    } else {
        try {
            const signupResult = await userAgent.registerUser(
                req.body.data.user.email,
                req.body.data.user.username,
                req.body.data.user.password,
                req.body.pub,
            );
            httpUtil.sendResult(signupResult, res);
        } catch (e) {
            log.error("Signing up user failed: " + e);
            res.status(400).send({
                message: e.message,
            });
        }
    }
});

module.exports = router;
