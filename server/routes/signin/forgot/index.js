/**
 * @module Sign-in-Forgot
 */

const log = require("../../../util/log");
const express = require('express');
const router = express.Router();
const resetRepository = require("../../../repositories/reset");
const util = require("../../../util");
const httpUtil = require("../../../util/http");
const tokenSender = require("../../../modules/verification/token");
const authService = require("../../../modules/authentication/");
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
router.post('/', authService.requireNoAuthentication, async (req, res) => {
    const email = req.body.data.email;
    log.info("'%s': Starting password reset", email);
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status !== 200) {
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    try {
        await tokenSender.storeAndSendPasswordResetToken(checkEmailResult.user.id, email);
        log.info("'%s': Password reset token successfully sent to email", email);
        res.status(200).send({
            message: "Code sent successfully to " + email,
        });
    } catch (e) {
        log.error("'%s': Failed sending password reset token to email", email);
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
router.post('/confirm', authService.requireNoAuthentication, async (req, res) => {
    log.info("'%s': Confirming password reset token", req.body.data.email);
    const tokenReceived = req.body.data.token;
    const email = req.body.data.email;
    const checkEmailResult = await util.checkEmail(email);
    if (checkEmailResult.status !== 200) {
        log.error("'%s': Confirming password reset token failed - email error: " + checkEmailResult.message, req.body.data.email);
        return res.status(checkEmailResult.status).send(checkEmailResult.message);
    }
    if (!tokenReceived) {
        log.error("'%s': Confirming password reset token failed - no token specified", req.body.data.email);
        return res.status(400).send("Token not defined");
    }

    resetRepository.findLatestByUserId(checkEmailResult.user.id)
        .then(result => {
            if (result.rows.length === 0) {
                log.error("'%s': Confirming password reset token failed - no password reset token exists", req.body.data.email);
                return res.status(404).send("No token sent to " + email);
            }

            const tokenSent = result.rows[0].passwordToken;
            const expiryDate = result.rows[0].expiryDate;

            if (tokenSent === tokenReceived && new Date() <= expiryDate) {
                log.info("'%s': Confirming password reset token successful", req.body.data.email);
                const authToken = authService.grantResetAccess(checkEmailResult.user.id, req.body.pub);
                res.status(200).send({
                    message: "Token accepted",
                    data: {
                        authToken: authToken,
                    },
                });
            } else if (tokenSent !== tokenReceived) {
                log.error("'%s': Confirming password reset token failed - tokens did not match", req.body.data.email);
                res.status(400).send("Tokens did not match");
            } else {
                log.error("'%s': Confirming password reset token failed - token expired", req.body.data.email);
                res.status(400).send("Token expired");
            }
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
