/**
 * @module Sign-up-User
 */

const express = require("express");
const router = express.Router();
const userAgent = require("../../../modules/authentication/user-agent");
const authAgent = require("../../../modules/authentication/auth-agent");
const owasp = require("owasp-password-strength-test");
const httpUtil = require("../../../util/httpUtil");

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
 * @param {number} req.body.userId since no userId yet, null here
 * @param {string} req.body.authToken since no authToken yet, null here
 * @param {object} req.body.data.user the user input values for their user account
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "userId": null,
        "authToken": null,
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
router.post("/", authAgent.requireNoAuthentication, async (req, res) => {
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
            res.status(400).send({
                message: e.message,
            });
        }
    }
});

module.exports = router;
