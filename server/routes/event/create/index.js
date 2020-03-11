/**
 * @module Event-Create
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../../util/httpUtil");
const validation = require("../../../modules/validation");
const eventService = require("../../../modules/eventService/");

/**
 * Endpoint called whenever a user creates a new event.<br/>
 * If an existing addressId is specified in the request, it is reused and no new address is created.<br/>
 * URL example: POST http://localhost:8000/event/create/
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "address": {
        "address1": "Line 1",
        "address2": "Line 2",
        "postcode": "14 aa",
        "city": "LDN",
        "region": "LDN again",
        "lat": 0.3,
        "long": 100.50
    },
    "name": "event",
    "womenOnly": true,
    "spots": 3,
    "addressVisible": true,
    "minimumAge": 16,
    "photoId": true,
    "physical": true,
    "addInfo": true,
    "content": "fun event yay",
    "date": "2004-10-19 10:23:54",
    "userId": 3
 }
 </pre>
 * "address" can be substituted with <pre>"addressId: {Integer}"</pre> in which case the existing address is reused.
 * @returns {object}
 *  status: 200, description: The event object created with its id and addressId set to the ones stored in the database<br/>
 <pre>
 {
    "message": "New event created",
    "data": {
        "event": {
            "name": "event",
            "addressId": 5,
            "womenOnly": true,
            "spots": 3,
            "addressVisible": true,
            "minimumAge": 16,
            "photoId": true,
            "physical": true,
            "addInfo": true,
            "content": "fun event yay",
            "date": "2004-10-19 10:23:54",
            "userId": 3,
            "creationDate": "2019-10-19 10:23:54"
        }
    }
 }
 </pre>
 *  status: 400, description: User has reached their monthly event creation limit.<br/>
 *  status: 500, description: DB error
 *  @name Create new event
 *  @function
 */
router.post("/", async (req, res) => {
    try {
        const event = req.body;
        const validationResult = validation.validateEvent(event);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const eventCreationResult = await eventService.createNewEvent(event);
        return httpUtil.sendResult(eventCreationResult, res);
    } catch (e) {
        console.log("Event creation failed: " + e);
        return httpUtil.sendGenericError(e);
    }
});

module.exports = router;
