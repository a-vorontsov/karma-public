/**
 * @module Settings
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/httpUtil");
const settingsService = require("../../modules/settings/");
const authAgent = require("../../modules/authentication/auth-agent");

router.post("/", authAgent.acceptAnyAuthentication, async (req, res) => {
    try {
        const settings = req.body;
        const settingsResult = await settingsService.changeSettings(settings);
        return httpUtil.sendResult(settingsResult, res);
    } catch (e) {
        console.log(e);
        return httpUtil.sendGenericError(e, res);
    }
});

router.get("/", authAgent.acceptAnyAuthentication, async (req, res) => {
    try {
        const userId = req.body.userId;
        const settingsResult = await settingsService.getCurrentSettings(userId);
        return httpUtil.sendResult(settingsResult, res);
    } catch (e) {
        console.log(e);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
