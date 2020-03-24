/**
 * @module Sign-out
 */

const log = require("../../util/log");
const express = require("express");
const router = express.Router();
const authAgent = require("../../modules/authentication/auth-agent");

/**
 * Endpoint called whenever a user wishes to sign-out from the
 * application.</br>
 * No special parameters need to be provided, but userId and
 * authToken must be present, as in any other request.</br>
 * This logs out the user by setting their current authToken
 * expired and therefore ending their session.
 <p><b>Route: </b>/signout (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if successful logout, 200 - successfully logged out<br/>
 * - if user is not authenticated when calling this endpoint (why
 * would they), 403 - user not authorised<br/>
 * - in case of any other error, 500 - error message
 * @name Sign-out
 * @function
 */
router.get("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        log.info("Logging user out");
        authAgent.logOut(req.body.authToken);
        res.status(200).send({
            message: "User successfully logged out.",
        });
    } catch (e) {
        log.error("Logging user out failed");
        res.status(500).send({
            message: e.message,
        });
    }
});

module.exports = router;
