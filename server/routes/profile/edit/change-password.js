const express = require("express");
const router = express.Router();
const users = require("../../../modules/authentication/user-agent");
const auth = require("../../../modules/authentication/check-auth");
const owasp = require("owasp-password-strength-test");

router.get("/", auth.checkAuthenticated, (req, res) => {
    res.render("change-password.ejs", {name: req.user.name});
});

/**
 * Attempt to change the password for a given user.
 * Returns success or one of the following errors:
 * - if confirm password mismatch, err == passwords don't match
 * - if password is not strong enough, err == passStrengthTest errors
 * - if user is not found with given id, err == user not found
 * - if oldPassword != user's password, err == incorrect old password
 * @param {HTTP} req must contain userId, oldPassword, newPassword, confirmPassword
 * @return {HTTP} res
 */
router.post("/", async (req, res) => {
    const passStrengthTest = owasp.test(req.body.newPassword);
    if (req.body.newPassword !== req.body.confirmPassword) {
        res.status(400).send({message: "Passwords do not match."});
    } else if (!passStrengthTest.strong && process.env.SKIP_PASSWORD_CHECKS === "0") {
        res.status(400).send(passStrengthTest.errors);
    } else if (!users.userExists(req.userId)) {
        res.status(400).send({message: "User with given ID does not exist."});
    } else if (!users.isCorrectPassword(req.userId, req.body.oldPassword)) {
        res.status(400).send({message: "Incorrect old password."});
    } else {
        try {
            users.updatePassword(req);
            res.status(200).send({message: "Password successfully updated."});
        } catch (e) {
            res.status(400).send({message: e.message});
        }
    }
});

module.exports = router;
