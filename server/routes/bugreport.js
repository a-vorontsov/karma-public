const express = require("express");
const router = express.Router();
const mailSender = require("../modules/mailSender/index");

/**
 * Attempt send a bug report to admin email account.
 * This requires a contact email address to be provided/input
 * by the app user (as bugs may occur when a user is not
 * signed-in). Returns success or an error message from
 * the mailSender module.
 * @param {HTTP} req
 * @param {string} email of user (typed-in)
 * @param {string} report bug description (typed-in)
 * @return {HTTP} one of the following HTTP responses:
 * - if email successfully sent, 200 - bug report sent
 * - if any error, 400 - error msg from mailSender module
 */
router.post("/", async (req, res) => {
    try {
        mailSender.sendBugReport(req.body.email, req.body.report);
        res.status(200).send({message:
            "Bug report sent.",
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
