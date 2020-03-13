/**
 * @module Sign-in-Email
 */

const express = require("express");
const router = express.Router();
const authAgent = require("../../../modules/authentication/auth-agent");
const regStatus = require("../../../modules/authentication/registration-status");
const userAgent = require("../../../modules/authentication/user-agent");
const tokenSender = require("../../../modules/verification/tokenSender");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");
const userRepo = require("../../../models/databaseRepositories/userRepository");

/**
 * This is the first step of the signup flow.
 * The user only inputs their email address, and
 * a HTTP response will be sent based on the user's
 * registration status.
 * @route {POST} /signin/email
 * @param {number} req.body.userId since no userId yet, null here
 * @param {string} req.body.authToken since no authToken yet, null here
 * @param {string} req.body.data.email input email address of the user
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "userId": null,
        "authToken": null,
        "data": &#123;
            "email": "paul&#64;karma.com",
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if user/request already authenticated, 400 - already auth<br/>
 * - if user fully registered, 200 - go to login<br/>
 * - if email != exist, store email in DB, 400 - go to email verif<br/>
 * - if email != exist & store email FAILED, 500 - error of DB insert<br/>
 * - if email verif, but user unregistered, 400 - go to reg<br/>
 * - if partly reg (only user acc), 400 - go to indiv/org reg<br/>
 * - if none of the above, 500 - reg & user object as JSON<br/>
 * - if invalid query, 500 - error message<br/><br/>
 * Response variables explained
 <pre><code>
    &#123;
        "message:" // textual explanation of scenario
        "data": &#123;
            "isEmailVerified": // if email is recorded and verified. If false, user has been sent a token
            "isSignedUp": false, // if user is registered (email & password) but they don't have a full profile
            "isFullySignedUp": false, // user is fully registered. go to login
        &#125;
    &#125;
</code></pre>
 * An example response:
 <pre><code>
    &#123;
        "message:" "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
        "data": &#123;
            "isEmailVerified": false,
            "isSignedUp": false,
            "isFullySignedUp": false,
        &#125;
    &#125;
</code></pre>
 * @name Sign-in with Email
 * @function
 */
router.post("/", authAgent.requireNoAuthentication, async (req, res) => {
    try {
        if (!(await regStatus.emailExists(req.body.data.email))) {
            try {
                await userAgent.registerEmail(req.body.data.email);
                res.status(400).send({
                    message: "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
                    data: {
                        isEmailVerified: false,
                        isSignedUp: false,
                        isFullySignedUp: false,
                    },
                });
            } catch (e) {
                res.status(500).send({
                    message: "Email did not exist. Error in recording user's email in database. Please see error message: " + e.message,
                    data: {
                        isEmailVerified: false,
                        isSignedUp: false,
                        isFullySignedUp: false,
                    },
                });
            }
        } else if (!(await regStatus.isEmailVerified(req.body.data.email))) {
            await tokenSender.storeAndSendEmailVerificationToken(req.body.data.email);
            res.status(400).send({
                message: "Email exists but unverified. The user has been sent a new verification token. Go to email verification screen.",
                data: {
                    isEmailVerified: false,
                    isSignedUp: false,
                    isFullySignedUp: false,
                },
            });
        } else if (!(await regStatus.userAccountExists(req.body.data.email))) {
            res.status(400).send({
                message: "Email verified, but no user account. Go to user registration screen.",
                data: {
                    isEmailVerified: true,
                    isSignedUp: false,
                    isFullySignedUp: false,
                },
            });
        } else if (await regStatus.isPartlyRegistered(req.body.data.email)) {
            res.status(400).send({
                message: "User account registered, but no indiv/org profile. Aks for password and then go to indiv/org selection screen.",
                data: {
                    isEmailVerified: true,
                    isSignedUp: true,
                    isFullySignedUp: false,
                },
            });
        } else if (await regStatus.isFullyRegisteredByEmail(req.body.data.email)) {
            res.status(200).send({
                message: "Fully registered. Go to login screen.",
                data: {
                    isEmailVerified: true,
                    isSignedUp: true,
                    isFullySignedUp: true,
                },
            });
        } else {
            // try to construct the records in the registration and user
            // tables for debugging the error
            const regRecord = [];
            const userRecord = [];
            try {
                const regResult = await regRepo.findByEmail(req.body.data.email);
                regRecord = regResult.rows[0];
                const userResult = await userRepo.findByEmail(req.body.data.email);
                userRecord = userResult.rows[0];
            } catch (e) {
                userRecord = e.message;
            }
            res.status(500).send({
                message:
                "Logical or internal system error. Please debug the registration and user objects:",
                regStatus: regRecord,
                userStatus: userRecord,
            });
        }
    } catch (e) {
        // in case of invalid queries, an error may be thrown
        res.status(500).send({
            message: e.message,
        });
    }
});

module.exports = router;
