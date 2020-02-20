const express = require("express");
const router = express.Router();
const auth = require("../../modules/authentication/check-auth");
const userAgent = require("../../modules/authentication/user-agent");

/**
 * This is the first step of the signup flow.
 * The user only inputs their email address, and
 * a HTTP response will be sent based on the user's
 * registration status.
 * @route {POST} /signin/email
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {string} email the user's email address
 * @return {HTTP} one of the following HTTP responses
 * - if user/request already authenticated, 400 - already auth
 * - if user fully registered, 200 - goto login
 * - if email != exist || unverified, 400 - goto email verif
 * - if email verif, but user unregistered, 400 - goto reg
 * - if partly reg (only user acc), 400 - goto indiv/org reg
 * - if none of the above, 500 - user object as JSON
 */
router.post("/", auth.checkNotAuthenticated, async (req, res) => {
    if (userAgent.isFullyRegistered(req.email)) {
        res.status(200).send({
            message: "Fully registered. Goto login screen.",
        });
    }
    if (
        !userAgent.emailExists(req.email) || !userAgent.isEmailVerified(req.email)
    ) {
        res.status(400).send({
            message: "Email does not exist. Goto email verification screen.",
        });
    } else if (!userAgent.isPartlyRegistered(req.email)) {
        res.status(400).send({
            message: "Email verified, but no user account. Goto user registration screen.",
        });
    } else if (userAgent.isPartlyRegistered(req.email)) {
        res.status(400).send({
            message: "User account registered, but no indiv/org profile. Goto indiv/org selection screen.",
        });
    } else {
        res.status(500).send({
            message: "This condition should not be executed. Please debug the user object:",
            user: userAgent.findByEmail(email),
        });
    }
});

module.exports = router;
