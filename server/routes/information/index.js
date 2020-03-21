/**
 * @module Information
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../util/httpUtil");
const informationService = require("../../modules/informationService/");
const authAgent = require("../../modules/authentication/auth-agent");

/**
 * Endpoint called whenever a user requests information about an information type.<br/>
 * URL example: GET http://localhost:8000/information?type=privacyPolicy
 <p><b>Route: </b>/information (GET)</p>
 <p><b>Permissions: </b>any</p>
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
