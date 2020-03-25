/**
 * @module Settings
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/http");
const settingsService = require("../../modules/settings/");
const authService = require("../../modules/authentication/");

/**
 * Endpoint called whenever a user wants to update the settings.<br/>
 * URL example: POST http://localhost:8000/settings
 <p><b>Route: </b>/settings (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {Settings} req.body - Information regarding the setting flags to update
 <pre>
 {
    "email": 1,
    "notifications": 1
}
 </pre>
 * @returns {Object}
 *  status: 200, description: The settings were fetched successfully.<br/>
 *  status: 400, description: Wrong input format.
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Settings fetched successfully",
    "data": {
        "settings": {
            "email": 1,
            "notifications": 0
        }
    }
}
 </pre>
 *  @name Change settings
 *  @function
 */
router.post("/", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Changing settings", req.body.userId);
        const settings = req.body;
        const settingsResult = await settingsService.changeSettings(settings);
        return httpUtil.sendResult(settingsResult, res);
    } catch (e) {
        log.error("User id '%d': Failed changing settings: " + e, req.body.userId);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user wants to check the current settings.<br/>
 * URL example: GET http://localhost:8000/settings
 <p><b>Route: </b>/settings (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @returns {Object}
 *  status: 200, description: The settings were fetched successfully.<br/>
 *  status: 400, description: Wrong input format.
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Settings fetched successfully",
    "data": {
        "settings": {
            "email": 0,
            "notifications": 0
        }
    }
}
 </pre>
 *  @name Get settings
 *  @function
 */
router.get("/", authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Getting settings", req.body.userId);
        const userId = req.query.userId;
        const settingsResult = await settingsService.getCurrentSettings(userId);
        return httpUtil.sendResult(settingsResult, res);
    } catch (e) {
        log.error("User id '%d': Failed getting settings: " + e, req.body.userId);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
