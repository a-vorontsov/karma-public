/**
 * @module Events
 */

const express = require("express");
const router = express.Router();

const eventSignupRoute = require("./signup/");
const eventFavouriteRoute = require("./favourite/");
const eventSelectRoute = require("./select/");

const httpUtil = require("../../util/httpUtil");
const validation = require("../../modules/validation");
const eventService = require("../../modules/event/eventService");

router.use("/", eventSignupRoute);
router.use("/", eventFavouriteRoute);
router.use("/", eventSelectRoute);

/**
 * Endpoint called whenever a user creates a new event.<br/>
 * If an existing addressId is specified in the request, it is reused and no new address is created.<br/>
 * URL example: POST http://localhost:8000/event/
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
        return httpUtil.sendGenericError(e, res);
    }
});

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
router.post("/update/:id", async (req, res) => {
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
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user requests information about an event.
 * URL example: GET http://localhost:8000/event/5
 * @param {Number} id - id of requested event.
 * @returns {object}
 *  status: 200, description: Information regarding the event containing the same properties as this example
 <pre>
 {
    "message": "Event fetched successfully",
    "data": {
        "event": {
            "id": 7,
            "name": "event",
            "addressId": 24,
            "womenOnly": true,
            "spots": 3,
            "addressVisible": true,
            "minimumAge": 16,
            "photoId": true,
            "physical": true,
            "addInfo": true,
            "content": "fun event yay",
            "date": "2004-10-19T09:23:54.000Z",
            "userId": 27,
            "spotsRemaining": 1,
            "address": {
                "id": 24,
                "address1": "221B Baker St",
                "address2": "Marleybone",
                "postcode": "NW1 6XE",
                "city": "London",
                "region": "Greater London",
                "lat": 51.5237740,
                "long": -0.1585340
            }
        }
    }
}
 </pre>
 *  status: 500, description: DB error
 *  @function
 *  @name Get event by id
 *  */
router.get("/:id", async (req, res) => {
    try {
        const id = Number.parseInt(req.params.id);
        const getEventResult = await eventService.getEventData(id);
        return httpUtil.sendResult(getEventResult, res);
    } catch (e) {
        console.log("Event fetching failed for event id '" + req.params.id + "' : " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
