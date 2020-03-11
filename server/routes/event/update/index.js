/**
 * @module Event-Update
 */

const express = require("express");
const router = express.Router();

const httpUtil = require("../../../util/httpUtil");
const validation = require("../../../modules/validation");
const eventService = require("../../../modules/eventService/");

/**
 * Endpoint called whenever a user updates an event.<br/>
 * URL example: POST http://localhost:8000/event/update/5
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "address": {
        "id": 5,
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
 * Note that address must have an id.
 * @returns {object}
 *  status: 200, description: The updated event object.<br/>
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
 *  status: 500, description: DB error
 *  @function
 *  @name Update event
 */
router.post("/:id", async (req, res) => {
    try {
        const event = {...req.body, id: Number.parseInt(req.params.id)};
        const validationResult = validation.validateEvent(event);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const eventUpdateResult = await eventService.updateEvent(event);
        return httpUtil.sendResult(eventUpdateResult, res);
    } catch (e) {
        console.log("Event updating failed: " + e);
        return httpUtil.sendGenericError(e);
    }
});

module.exports = router;
