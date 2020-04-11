/**
 * @module Profile-Causes
 */
const log = require("../../../util/log");
const express = require("express");
const router = express.Router();
const authService = require("../../../modules/authentication/");
const selectedCauseRepo = require("../../../repositories/cause/selected");
const httpUtil = require("../../../util/http");

/**
 * Gets all causes for current user.<br/>
 <p><b>Route: </b>profile/causes (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @returns {object}
 *  status: 200, description: Array of all cause objects<br/>
 *  status: 500, description: Most probably a database error occurred
 <pre>
 {
    "data": [
        {
            "userId": 1,
            "causeId": 1,
            "id": 1,
            "name": "animals",
            "description": "Morbi accumsan laoreet ipsum. Curabitur",
            "title": "Animals"
        },
        {
            "userId": 1,
            "causeId": 4,
            "id": 4,
            "name": "energy",
            "description": "nonummy. Fusce fermentum fermentum arcu.",
            "title": "Energy"
        },
        {
            "userId": 1,
            "causeId": 5,
            "id": 5,
            "name": "education",
            "description": "malesuada ut, sem. Nulla interdum.",
            "title": "Education"
        },
        {
            "userId": 1,
            "causeId": 6,
            "id": 6,
            "name": "peace",
            "description": "montes, nascetur ridiculus mus. Aenean",
            "title": "Peace & Justice"
        }
    ]
}
 </pre>
 *  @name Get all causes for current user
 *  @function
 */
router.get('/', authService.requireAuthentication, async (req, res) => {
    try {
        log.info("%s: Getting all causes for current user", req.query.userId ? `User id '${req.query.userId}'` : req.query.userId);
        const allCausesResult = await selectedCauseRepo.findByUserId(req.query.userId);
        const causes = {
            status: 200,
            message: "Causes for current user fetched successfully.",
            data: allCausesResult.rows,
        };
        httpUtil.sendResult(causes, res);
    } catch (e) {
        log.error("%s: Getting all causes for current user: " + e, req.query.userId ? `User id '${req.query.userId}'` : req.query.userId);
        httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
