/**
 * @module Sign-in-forgotPassword
 */

const express = require('express');
const router = express.Router();
const resetRepository = require("../../../models/databaseRepositories/resetRepository");
const util = require("../../../util/util");
const tokenSender = require("../../../modules/verification/tokenSender");

/**
 * Endpoint called whenever a user requests a reset password token.<br/>
 * URL example: POST http://localhost:8000/signin/forgot
 * @param {String} req.body.data.email - Email of the user
 * @returns
 *  status: 200, description: Token sent successfully. Valid for use 1 hour from sending <br/>
 *  status: 400, description: Email not specified in request body <br/>
 *  status: 404, description: User with email specified not found <br/>
 *  status: 500, description: DB error or error in sending email
 *  @name Forgot password
 *  @function
 */
router.post('/', async (req, res) => {
    const email = req.body.data.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    try {
        await tokenSender.storeAndSendPasswordResetToken(checkEmailResult.user.id, email);
        res.status(200).send({
            message: "Code sent successfully to " + email,
        });
    } catch (e) {
        res.status(500).send({
            message: e.message,
        });
    }
});

/**
 * Endpoint called whenever a user writes in the token they recieved and click submit.<br/>
 * URL example: POST http://localhost:8000/signin/forgot
 * @param {String} req.body.data.email - Email of the user
 * @param {String} req.body.data.token - Token input by user
 * @returns
 *  status: 200, description: Token is accepted <br/>
 *  status: 400, description: Email or Token not specified in request body <br/>
 *  status: 400, description: Token did not match sent token <br/>
 *  status: 400, description: Token expired(tokens are valid only for 1 hour) <br/>
 *  status: 404, description: Token sent to specified email not found <br/>
 *  status: 500, description: DB error
 *  @name Confirm token
 *  @function
 */
router.post('/confirm', async (req, res) => {
    const tokenRecieved = req.body.data.token;
    const email = req.body.data.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    if (!tokenRecieved) return res.status(400).send("Token not defined");

    resetRepository.findLatestByUserID(checkEmailResult.user.id)
        .then(result => {
            if (result.rows.length === 0) return res.status(404).send("No token sent to " + email);

            const tokenSent = result.rows[0].passwordToken;
            const expiryDate = result.rows[0].expiryDate;

            if (tokenSent === tokenRecieved && new Date() <= expiryDate) {
                res.status(200).send("Token accepted");
            } else if (tokenSent !== tokenRecieved) {
                res.status(400).send("Tokens did not match");
            } else {
                res.status(400).send("Token expired");
            }
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
