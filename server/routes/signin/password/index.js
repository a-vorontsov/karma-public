/**
 * @module Sign-in-Password
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const authService = require("../../../modules/authentication/");
const userAgent = require("../../../modules/user");
const httpUtil = require("../../../util/http");

/**
 * Attempt to log in an existing user with given email & password.<br/>
 * If the incoming request already has a userId and valid authToken
 * the response will state that the user is already authenticated and
 * the sing-in operation & password validation will not continue.<br/>
 * Upon a successful login attempt, the response will contain the
 * userId as well as a new and valid authToken for the user.
 <p><b>Route: </b>/signin/password (POST)</p>
 <p><b>Permissions: </b>require not auth</p>
 * @param {string} req.headers.authorization authToken
 * @param {string} req.body.data.email the email address of the user
 * @param {string} req.body.data.password the input password of the user
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "data": &#123;
            "email": "paul&#64;karma.com",
            "password": "securePassword123!"
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses<br/>
 * - if user/request already authenticated, 400 - already auth<br/>
 * - if successful authentication, 200 - success, userId, authToken<br/>
 * - if invalid password, 400 - invalid password <br/>
 * - if user not found, other error, 400 - error message<br/>
 * Here is an example return object on success:
<pre><code>
    &#123;
        "userId": 123,
        "authToken": "secureAuthTokenForUser123",
        "message": "Successful authentication with email & password.",
    &#125;
</code></pre>
 * @name Sign-in with Password
 * @function
 */
router.post("/", authService.requireNoAuthentication, async (req, res) => {
    try {
        log.info("'%s': Starting sign-in with password", req.body.data.email);
        const signInResult = await userAgent.signIn(req.body.data.email, req.body.data.password, req.body.pub);
        httpUtil.sendResult(signInResult, res);
    } catch (e) {
        log.error("'%s': Sign-in with password failed: " + e, req.body.data.email);
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
