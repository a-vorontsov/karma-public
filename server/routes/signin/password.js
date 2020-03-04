/**
 * @module Sign-in-password
 */

const express = require("express");
const router = express.Router();
const authAgent = require("../../modules/authentication/auth-agent");
const userAgent = require("../../modules/authentication/user-agent");

/**
 * Attempt to log in an existing user with given email & password.<br/>
 * If the incoming request already has a userId and valid authToken
 * the response will state that the user is already authenticated and
 * the sing-in operation & password validation will not continue.<br/>
 * Upon a successful login attempt, the response will contain the
 * userId as well as a new and valid authToken for the user.
 * @route {POST} /signin/password
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {string} email the user's email address
 * @param {string} password
 * @return {HTTP} one of the following HTTP responses<br/>
 * - if user/request already authenticated, 400 - already auth<br/>
 * - if successful authentication, 200 - success, userId, authToken<br/>
 * - if invalid password, 400 - invalid password <br/>
 * - if user not found, other error, 400 - error message
 * @name Sign-in with password
 * @function
 */
router.post("/", authAgent.requireNoAuthentication, async (req, res) => {
    try {
        if (await userAgent.isCorrectPasswordByEmail(req.body.email, req.body.password)) {
            const userId = await userAgent.getUserId(req.body.email);
            const authToken = await authAgent.logIn(userId);
            res.status(200).send({
                message: "Successful authentication with email & password.",
                userId: userId,
                authToken: authToken,
            });
        } else {
            res.status(400).send({
                message: "Invalid password.",
            });
        }
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
