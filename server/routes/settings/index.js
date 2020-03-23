/**
 * @module Settings
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/httpUtil");
const settingsService = require("../../modules/settings/");
const authAgent = require("../../modules/authentication/auth-agent");

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
 *  @name Post settings
 *  @function
 */
router.post("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        const settings = req.body;
        const settingsResult = await settingsService.changeSettings(settings);
        return httpUtil.sendResult(settingsResult, res);
    } catch (e) {
        console.log(e);
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
router.get("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        const userId = req.query.userId;
        const settingsResult = await settingsService.getCurrentSettings(userId);
        return httpUtil.sendResult(settingsResult, res);
    } catch (e) {
        console.log(e);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
