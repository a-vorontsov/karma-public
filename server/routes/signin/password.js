const express = require("express");
const router = express.Router();
const passport = require("passport");
const auth = require("../../modules/authentication/check-auth");

/**
 * //TODO: Move to token based authentication, with DB storage.
 * Attempt to log in an existing user with local strategy
 * (email & password).
 * A HTTP redirect is generated based on the outcome of the
 * operation, and a result is sent appropriate to the
 * redirection destination.
 * If a user is not found with the given email, the response
 * will still state "Invalid email or password"!
 * @route {POST} /signin/password
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {string} email the user's email address
 * @param {string} password
 * @return {HTTP} one of the following HTTP responses
 * - if user/request already authenticated, 400 - already auth
 * - if successful authentication, 200 - success with password
 * - if invalid password || email not found, 400 - invalid email or password
 */
router.post(
    "/",
    auth.checkNotAuthenticated,
    passport.authenticate("local", {
        successRedirect: "/signin/password/success",
        failureRedirect: "/signin/password/fail",
        failureFlash: false,
    }),
);

router.get("/success", (req, res) => {
    res.status(200).send({
        message: "Successful authentication with email & password.",
    });
});

router.get("/fail", (req, res) => {
    res.status(400).send({
        message: "Invalid email or password.",
    });
});

module.exports = router;
