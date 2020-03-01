/**
 * @module Log-out
 */

const express = require("express");
const router = express.Router();
const auth = require("../../modules/authentication/check-auth");

/**
 * Endpoint called whenever a user wishes to log out from the
 * application.</br>
 * No special parameters need to be provided, but userId and
 * authToken must be present, as in any other request.</br>
 * This logs out the user by destroying their current authToken
 * and therefore ending their session.
 * @route {GET} /logout
 * @param {HTTP} req
 * @param {HTTP} res
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if successful logout, 200 - successfully logged out<br/>
 * - if user is not authenticated when calling this endpoint (why
 * would they), 403 - user not authorised<br/>
 * - in case of any other error, 500 - error message
 * @name Log-out
 * @function
 */
router.get("/", auth.checkAuthenticated, async (req, res) => {
    try {
        auth.logOut(req.body.userId);
        res.status(200).send({
            message: "User successfully logged out.",
        });
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
});

module.exports = router;
