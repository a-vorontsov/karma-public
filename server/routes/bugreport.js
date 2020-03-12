/**
 * @module Send-bug-report
 */

const express = require("express");
const router = express.Router();
const mailSender = require("../modules/mailSender/index");

/**
 * Attempt send a bug report to admin email account.
 * This requires a contact email address to be provided/input
 * by the app user (as bugs may occur when a user is not
 * signed-in). Returns success or an error message from
 * the mailSender module.
 * @route {POST} /bugreport
 * @param {number} req.body.userId can be anything
 * @param {string} req.body.authToken can be anything
 * @param {object} req.body.data.email user input email address
 * @param {object} req.body.data.report user input bug report
 * @param {object} req.body Here is an example of an appropriate request json:
<pre><code>
    &#123;
        "userId": 123,
        "authToken": "secureToken",
        "data": &#123;
            "email": "ihaveabug@gmail.com",
            "report": "I can't date",
        &#125;
    &#125;
</code></pre>
 * @return {HTTP} one of the following HTTP responses:<br/>
 * - if email successfully sent, 200 - bug report sent<br/>
 * - if any error, 400 - error msg from mailSender module
 * @name Send bug report
 * @function
 */
router.post("/", async (req, res) => {
    try {
        mailSender.sendBugReport(req.body.data.email, req.body.data.report);
        res.status(200).send({
            message: "Bug report sent.",
        });
    } catch (e) {
        res.status(400).send({
            message: e.message,
        });
    }
});

module.exports = router;
