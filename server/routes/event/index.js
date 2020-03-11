/**
 * @module Event
 */

const express = require("express");
const router = express.Router();

const eventSignupRoute = require("./signup");
const eventFavouriteRoute = require("./favourite");
const eventSelectRoute = require("./select");

const httpUtil = require("../../util/httpUtil");
const eventService = require("../../modules/eventService/");

router.use("/", eventSignupRoute);
router.use("/", eventFavouriteRoute);
router.use("/", eventSelectRoute);

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
        return httpUtil.sendGenericError(e);
    }
});

module.exports = router;
