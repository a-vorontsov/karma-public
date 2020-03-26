/**
 * @module Sign-in-Email
 */

const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const authService = require("../../../modules/authentication/");
const regStatus = require("../../../util/registration");
const userAgent = require("../../../modules/user");
const tokenSender = require("../../../modules/verification/token");

/**
 * This is the first step of the signup flow.
 * The user only inputs their email address, and
 * a HTTP response will be sent based on the user's
 * registration status.
 <p><b>Route: </b>/signin/email (POST)</p>
 <p><b>Permissions: </b>require not auth</p>
 * @param {string} req.headers.authorization authToken (can be null at this stage)
 * @param {string} req.body.data.email input email address of the user
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "data": &#123;
            "email": "paul&#64;karma.com",
        &#125;
    &#125;
</code></pre>
 * @return {Object} one of the following HTTP responses:<br/>
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
router.post("/", authService.requireNoAuthentication, async (req, res) => {
    try {
        log.info("'%s': Starting sign-in email sign-in", req.body.data.email);
        const email = req.body.data.email;
        if (!(await regStatus.emailExists(email))) {
            log.info("'%s': Sign-in with new account, registering email", email);
            try {
                await userAgent.registerEmail(email);
                log.info("'%s': Registering email successful", email);
                res.status(200).send({
                    message: "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
                    data: {
                        isEmailVerified: false,
                        isSignedUp: false,
                        isFullySignedUp: false,
                    },
                });
            } catch (e) {
                log.error("'%s': Registering email failed: " + e, email);
                res.status(500).send({
                    message: "Email did not exist. Error in recording user's email in database. Please see error message: " + e.message,
                    data: {
                        isEmailVerified: false,
                        isSignedUp: false,
                        isFullySignedUp: false,
                    },
                });
            }
        } else if (!(await regStatus.isEmailVerified(email))) {
            log.info("'%s': Sign-in with existing unverified email. Starting email verification", email);
            await tokenSender.storeAndSendEmailVerificationToken(email);
            res.status(200).send({
                message: "Email exists but unverified. The user has been sent a new verification token. Go to email verification screen.",
                data: {
                    isEmailVerified: false,
                    isSignedUp: false,
                    isFullySignedUp: false,
                },
            });
        } else if (!(await regStatus.userAccountExists(email))) {
            log.info("'%s': Sign-in with verified email. Starting user sign-up", email);
            res.status(200).send({
                message: "Email verified, but no user account. Go to user registration screen.",
                data: {
                    isEmailVerified: true,
                    isSignedUp: false,
                    isFullySignedUp: false,
                },
            });
        } else if (await regStatus.isPartlyRegistered(email)) {
            log.info("'%s': Sign-in with existing incomplete user. Starting profile creation", email);
            res.status(200).send({
                message: "User account registered, but no indiv/org profile. Ask for password and then go to indiv/org selection screen.",
                data: {
                    isEmailVerified: true,
                    isSignedUp: true,
                    isFullySignedUp: false,
                },
            });
        } else if (await regStatus.isFullyRegisteredByEmail(req.body.data.email)) {
            log.info("'%s': Sign-in with existing account.", email);
            res.status(200).send({
                message: "Fully registered. Go to login screen.",
                data: {
                    isEmailVerified: true,
                    isSignedUp: true,
                    isFullySignedUp: true,
                },
            });
        } else {
            log.error("'%s': Sign-in failed", email);
            res.status(500).send({
                message: "Logical or internal system error. Please debug the registration and user objects:",
            });
        }
    } catch (e) {
        // in case of invalid queries, an error may be thrown
        log.error("'%s': Sign-in failed: " + e, req.body.data.email);
        res.status(500).send({
            message: e.message,
        });
    }
});

module.exports = router;
