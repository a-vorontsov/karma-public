/**
 * @module Events
 */

const express = require("express");
const router = express.Router();
const addressRepository = require("../../models/databaseRepositories/addressRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");
const util = require("../../util/util");
const eventSignupRoute = require("./signup/eventSignup");
const eventFavouriteRoute = require("./favourite/eventFavourite");
const eventSelectRoute = require("./select/eventSelect");
const validation = require("../../modules/validation");

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
    "message": "New event created",
    "data": {
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
 }
 </pre>
 * "address" can be substituted with "addressId: {Integer}" in which case the existing address is reused.
 * @returns
 *  status: 200, description: The event object created with it's id and addressId set to the ones stored in the database<br/>
 *  status: 400, description: User has reached their monthly event creation limit.<br/>
 *  status: 500, description: DB error
 *  @name Create new event
 *  @function
 */
router.post("/", async (req, res) => {
    try {
        const event = req.body;
        const validationResult = validation.validateEvent(event);
        if (validationResult.errors.length !== 0) {
            return res.status(400).send({
                message: "Input validation failed",
                errors: validationResult.errors,
            });
        }

        const isIndividual = await util.isIndividual(event.userId);
        if (isIndividual) {
            const existingUserEvents = await eventRepository.findAllByUserId(
                event.userId,
            );
            if (existingUserEvents.rows.length >= 3) {
                return res
                    .status(400)
                    .send(
                        {message: "Event creation limit reached; user has already created 3 events this month."},
                    );
            }
        }

        if (!req.body.addressId) {
            // address doesn't exist in database yet
            const addressResult = await addressRepository.insert(event.address);
            event.addressId = addressResult.rows[0].id;
        }

        event.creationDate = new Date();
        const eventResult = await eventRepository.insert(event);
        res.status(200).send({
            message: "Event created successfully",
            data: eventResult.rows[0],
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({message: e.message});
    }
});

/**
 * Endpoint called whenever a user updates an event.<br/>
 * URL example: POST http://localhost:8000/event/update/5
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
{
    "message": "Event updated successfully",
    "data": {
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
 }
 </pre>
 * Note that address must have an id.
 * @returns
 *  status: 200, description: The event object updated event object.<br/>
 *  status: 500, description: DB error
 *  @function
 *  @name Update event
 */
router.post("/update/:id", async (req, res) => {
    const address = req.body.address;
    const event = req.body;
    const validationResult = validation.validateEvent(event);
    if (validationResult.errors.length !== 0) {
        return res.status(400).send({
            message: "Input validation failed",
            errors: validationResult.errors,
        });
    }

    event.addressId = address.id;
    event.id = req.params.id;
    try {
        await addressRepository.update(address);
        const updateEventResult = await eventRepository.update(event);
        res.status(200).send({
            message: "Event updated successfully",
            data: updateEventResult.rows[0],
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({message: e.message});
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
 </pre>
 *  status: 500, description: DB error
 *  @function
 *  @name Get event by id
 *  */
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const eventResult = await eventRepository.findById(id);
        const event = eventResult.rows[0];
        const addressResult = await addressRepository.findById(event.addressId);
        const address = addressResult.rows[0];
        res.status(200).send({
            message: "Event fetched successfully",
            data: {
                ...event,
                address: address,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({message: e.message});
    }
});

module.exports = router;
