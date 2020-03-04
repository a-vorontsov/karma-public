/**
 * @module signin-forgotPassword
 */

const express = require('express');
const router = express.Router();
const randomize = require('randomatic');
const mailSender = require('../../modules/mailSender');
const resetRepository = require("../../models/databaseRepositories/resetRepository");
const util = require("../../util/util");

/**
 * Endpoint called whenever a user requests a reset password token.<br/>
 * URL example: POST http://localhost:8000/signin/forgot
 * @param {String} req.body.email - Email of the user
 * @returns
 *  status: 200, description: Token sent successfully. Valid for use 1 hour from sending <br/>
 *  status: 400, description: Email not specified in request body <br/>
 *  status: 404, description: User with email specified not found <br/>
 *  status: 500, description: DB error or error in sending email
 *  @name Forgot password
 *  @function
 */
router.post('/', async (req, res) => {
    const email = req.body.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    const user = checkEmailResult.user;
    // generate 6 digit code
    const token = randomize('0', 6);
    // update the db
    resetRepository.insertResetToken(user.id, token)
        .then(() => mailSender.sendToken(email, token))
        .then(() => res.status(200).send("Code sent successfully to " + email))
        .catch(err => res.status(500).send(err));
});

/**
 * Endpoint called whenever a user writes in the token they recieved and click submit.<br/>
 * URL example: POST http://localhost:8000/signin/forgot
 * @param {String} req.body.email - Email of the user
 * @param {String} req.body.token - Token input by user
 * @returns
 *  status: 200, description: Token is accepted <br/>
 *  status: 400, description: Email or Token not specified in request body <br/>
 *  status: 401, description: Token did not match sent token or token expired(tokens are valid only for 1 hour) <br/>
 *  status: 404, description: Token sent to specified email not found <br/>
 *  status: 500, description: DB error
 *  @name Confirm token
 *  @function
 */
router.post('/confirm', async (req, res) => {
    const tokenRecieved = req.body.token;
    const email = req.body.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    if (!tokenRecieved) return res.status(400).send("Token not defined");

    resetRepository.findResetToken(checkEmailResult.user.id)
        .then(result => {
            if (result.rows.length == 0) return res.status(404).send("No token sent to " + email);

            const tokenSent = result.rows[0].password_token;
            const expiryDate = result.rows[0].expiry_date;

            if (tokenSent === tokenRecieved && new Date() <= expiryDate) {
                res.status(200).send("Token accepted");
            } else if (tokenSent != tokenRecieved) {
                res.status(401).send("Tokens did not match");
            } else {
                res.status(401).send("Token expired");
            }
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
