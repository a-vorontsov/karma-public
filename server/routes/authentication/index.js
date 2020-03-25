/**
 * @module Authentication
 */
const express = require("express");
const router = express.Router();
const authService = require("../../modules/authentication");
const httpUtil = require("../../util/http");
/**
 * Endpoint called whenever a client wishes to check the active
 * user's authentication status with minimum overhead and
 * avoiding any unnecessary transmission of data
 <p><b>Route: </b>/authentication (GET)</p>
 <p><b>Permissions: </b>any</p>
 * @param {string} req.headers.authorization authToken
 * @returns {object}
 * status: 200, description: Successful authentication
 * status: 400 - invalid request, description: Missing authorisation header
 * status: 401 - unauthenticated, description: Reason for failed authentication
 * @name Check authentication status
 * @function
 */
router.get("/", authService.requireAuthentication, async (req, res) => {
    // if you reach the following statement, authentication was successful
    httpUtil.sendResult({
        status: 200,
        message: "Successfully authenticated with user privileges.",
        data: {},
    }, res);
});

module.exports = router;
