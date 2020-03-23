/**
 * @module Admin-Information
 */
const log = require("../../../util/log");
const express = require("express");
const router = express.Router();

const httpUtil = require("../../../util/httpUtil");
const validation = require("../../../modules/validation");
const informationService = require("../../../modules/informationService/");
const authAgent = require("../../../modules/authentication/auth-agent");

/**
 * Endpoint called whenever an admin wants to upload new information such as Privacy Policy, Community Guidelines.<br/>
 <p><b>Route: </b>/admin/information (POST)</p>
 <p><b>Permissions: </b>require admin permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Information} req.body - Information regarding the information containing the same properties as this example:
 <pre>
 {
    "type": "privacyPolicy",
    "content": "This is a new privacy policy. We won't steal your data."
 }
 </pre>
 * @returns {object}
 *  status: 200, description: The information object created with its type<br/>
 <pre>
 {
    "message": "New information entry created",
    "data": {
        "information": {
            "type": "privacyPolicy",
            "content": "This is a new privacy policy. We won't steal your data."
        }
    }
 }
 </pre>
 *  status: 400, description: Wrong input format.<br/>
 *  status: 500, description: DB error
 *  @name Create new information entry
 *  @function
 */
router.post("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        log.info("Updating app information type '%s' initiated by administrator", req.body.type);
        const information = req.body;
        const validationResult = validation.validateInformation(information);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const informationResult = await informationService.changeInformation(information);
        return httpUtil.sendResult(informationResult, res);
    } catch (e) {
        log.error("Information update/creation failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
