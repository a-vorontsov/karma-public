/**
 * @module Register-user
 */

const express = require("express");
const router = express.Router();
const userAgent = require("../../modules/authentication/user-agent");
const authAgent = require("../../modules/authentication/auth-agent");
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
 * @name Register user
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
            const userId = await userAgent.registerUser(req.body.data.user.email, req.body.data.user.username, req.body.data.user.password);
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
