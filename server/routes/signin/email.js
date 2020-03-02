/**
 * @module Sign-in-email
 */

const express = require("express");
const router = express.Router();
const authAgent = require("../../modules/authentication/auth-agent");
const regStatus = require("../../modules/authentication/registration-status");
const userAgent = require("../../modules/authentication/user-agent");
const regRepo = require("../../models/registrationRepository");
const userRepo = require("../../models/userRepository");

/**
 * This is the first step of the signup flow.
 * The user only inputs their email address, and
 * a HTTP response will be sent based on the user's
 * registration status.
 * @route {POST} /signin/email
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {string} email the user's email address
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if user/request already authenticated, 400 - already auth<br/>
 * - if user fully registered, 200 - goto login<br/>
 * - if email != exist, store email in DB, 400 - goto email verif<br/>
 * - if email != exist & store email FAILED, 500 - error of DB insert<br/>
 * - if email verif, but user unregistered, 400 - goto reg<br/>
 * - if partly reg (only user acc), 400 - goto indiv/org reg<br/>
 * - if none of the above, 500 - reg & user object as JSON<br/>
 * - if invalid query, 500 - error message
 * @name Sign-in with email
 * @function
 */
router.post("/", authAgent.checkNotAuthenticated, async (req, res) => {
    try {
        if (!(await regStatus.emailExists(req.body.email))) {
            try {
                await userAgent.registerEmail(req.body.email);
                res.status(400).send({
                    message: "Email did not exist. Email successfully recorded, go to email verification screen.",
                });
            } catch (e) {
                res.status(500).send({
                    message: "Email did not exist. Error in recording user's email in database. Please see error message: " + e.message,
                });
            }
        } else if (!(await regStatus.isEmailVerified(req.body.email))) {
            res.status(400).send({
                message: "Email exists but unverified. Goto email verification screen.",
            });
        } else if (!(await regStatus.userAccountExists(req.body.email))) {
            res.status(400).send({
                message: "Email verified, but no user account. Goto user registration screen.",
            });
        } else if (await regStatus.isPartlyRegistered(req.body.email)) {
            res.status(400).send({
                message: "User account registered, but no indiv/org profile. Aks for password and then goto indiv/org selection screen.",
            });
        } else if (await regStatus.isFullyRegisteredByEmail(req.body.email)) {
            res.status(200).send({
                message: "Fully registered. Goto login screen.",
            });
        } else {
            // try to construct the records in the registration and user
            // tables for debugging the error
            const regRecord = [];
            const userRecord = [];
            try {
                const regResult = await regRepo.findByEmail(req.body.email);
                regRecord = regResult.rows[0];
                const userResult = await userRepo.findByEmail(req.body.email);
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
