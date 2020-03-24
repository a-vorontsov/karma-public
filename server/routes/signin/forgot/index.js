/**
 * @module Sign-in-Forgot
 */

const log = require("../../../util/log");
const express = require('express');
const router = express.Router();
const resetRepository = require("../../../models/databaseRepositories/resetRepository");
const util = require("../../../util/util");
const httpUtil = require("../../../util/httpUtil");
const tokenSender = require("../../../modules/verification/token");
const authAgent = require("../../../modules/authentication/");
/**
 * Endpoint called whenever a user requests a reset password token.<br/>
 <p><b>Route: </b>/signin/forgot (POST)</p>
 <p><b>Permissions: </b>require not auth</p>
 * @param {string} req.headers.authorization authToken
 * @param {String} req.body.data.email - Email of the user
 * @returns
 *  status: 200, description: Token sent successfully. Valid for use 1 hour from sending <br/>
 *  status: 400, description: Email not specified in request body <br/>
 *  status: 404, description: User with email specified not found <br/>
 *  status: 500, description: DB error or error in sending email
 *  @name Forgot password
 *  @function
 */
router.post('/', authAgent.requireNoAuthentication, async (req, res) => {
    const email = req.body.data.email;
    log.info("Resetting password for email '%s'", email);
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status !== 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    try {
        await tokenSender.storeAndSendPasswordResetToken(checkEmailResult.user.id, email);
        res.status(200).send({
            message: "Code sent successfully to " + email,
        });
    } catch (e) {
        log.error("Resetting password failed: " + e);
        httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user writes in the token they recieved and click submit.<br/>
 <p><b>Route: </b>/signin/forgot/confirm (POST)</p>
 <p><b>Permissions: </b>require not auth</p>
 * @param {string} req.headers.authorization authToken
 * @param {String} req.body.data.email - Email of the user
 * @param {String} req.body.data.token - Token input by user
 * @returns
 *  status: 200, description: Token is accepted, req.body.data.authToken <br/>
 *  status: 400, description: Email or Token not specified in request body <br/>
 *  status: 400, description: Token did not match sent token <br/>
 *  status: 400, description: Token expired(tokens are valid only for 1 hour) <br/>
 *  status: 404, description: Token sent to specified email not found <br/>
 *  status: 500, description: DB error
 *  @name Confirm token
 *  @function
 */
router.post('/confirm', authAgent.requireNoAuthentication, async (req, res) => {
    const tokenRecieved = req.body.data.token;
    const email = req.body.data.email;
    log.info("Confirming password reset token for email '%s'", email);
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status != 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    if (!tokenRecieved) return res.status(400).send("Token not defined");

    resetRepository.findLatestByUserId(checkEmailResult.user.id)
        .then(result => {
            if (result.rows.length === 0) return res.status(404).send("No token sent to " + email);

            const tokenSent = result.rows[0].passwordToken;
            const expiryDate = result.rows[0].expiryDate;

            if (tokenSent === tokenRecieved && new Date() <= expiryDate) {
                const authToken = authAgent.grantResetAccess(checkEmailResult.user.id, req.body.pub);
                res.status(200).send({
                    message: "Token accepted",
                    data: {
                        authToken: authToken,
                    },
                });
            } else if (tokenSent !== tokenRecieved) {
                res.status(400).send("Tokens did not match");
            } else {
                res.status(400).send("Token expired");
            }
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
