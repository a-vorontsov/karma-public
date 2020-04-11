/**
 * @module Profile-Delete
 */
const log = require("../../../util/log");
const express = require("express");
const router = express.Router();

const httpUtil = require("../../../util/http");
const deletionModule = require("../../../modules/deletion");
const authService = require("../../../modules/authentication/");

/**
 * Endpoint called whenever a user requests to delete all information
 * related to their account in the database <br/>
 <p><b>Route: </b>/profile/delete (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @returns {Object}
 *  status: 200, description: Success. Does NOT return user's data.<br/>
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "All User information deleted successfully"
 }
 </pre>
 *  @name Delete user info
 *  @function
 */
router.post("/", authService.requireAuthentication, async (req, res) => {
    try {
        const userId = req.query.userId;
        log.info("User id '%d': Account deletion requested, deleting all related data", userId);
        const deletionResult = await deletionModule.deleteAllInformation(userId);
        // we don't want to send back details of user object even if it's deleted
        delete deletionResult.data;
        // if we reach here account deletion was successful
        log.info("User id '%d': Account deletion completed", userId);
        return httpUtil.sendResult(deletionResult, res);
    } catch (e) {
        log.error("User id '%d': Account could not be deleted: " + e, req.query.userId);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
