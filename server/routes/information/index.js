/**
 * @module Information
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/httpUtil");
const validation = require("../../modules/validation");
const informationService = require("../../modules/informationService/");
const authAgent = require("../../modules/authentication/auth-agent");

/**
 * Endpoint called whenever an admin wants to upload new information such as Privacy Policy, Community Guidelines.<br/>
 * // TODO: move to admin/
 * URL example: POST http://localhost:8000/information/
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
router.post("/", async (req, res) => {
    try {
        const information = req.body;
        const validationResult = validation.validateInformation(information);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const informationResult = await informationService.changeInformation(information);
        return httpUtil.sendResult(informationResult, res);
    } catch (e) {
        console.log("Information creation failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user requests information about an information type.<br/>
 * URL example: GET http://localhost:8000/information?type=privacyPolicy
 * @param {String} req.query.type - type of information
 * @returns {Object}
 *  status: 200, description: The information of the requested type.<br/>
 *  status: 400, description: Wrong input format.
 *  status: 500, description: DB error
 *<pre>
 {
    "message": "Information entry fetched successfully.",
    "data": {
        "information": {
            "type": "privacyPolicy",
            "content": "Private"
        }
    }
 }
 </pre>
 *  @name Get information entry
 *  @function
 */
router.get("/", authAgent.anyAuth, async (req, res) => {
    try {
        const type = req.query.type;

        if (type === undefined) {
            return res.status(400).send({message: "Type is not specified"});
        }

        const informationResult = await informationService.getInformationData(type);
        return httpUtil.sendResult(informationResult, res);
    } catch (e) {
        console.log(e);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
