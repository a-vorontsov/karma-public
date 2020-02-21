const express = require('express');
const router = express.Router();
const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");
const causeRepository = require("../models/causeRepository");
const util = require("../util/util");

/**
 * Endpoint called whenever a user creates a new event.
 * If an existing address_id is specified in the request, it is reused and no new address is created.
 * URL example: POST http://localhost:8000/event/
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 {
        "address": {
            "address_1": "Line 1",
            "address_2": "Line 2",
            "postcode": "14 aa",
            "city": "LDN",
            "region": "LDN again",
            "lat": "0.3",
            "long": "100.50"
        },
        "name": "event",
        "women_only": "true",
        "spots": "3",
        "address_visible": "true",
        "minimum_age": "16",
        "photo_id": "true",
        "physical": "true",
        "add_info": "true",
        "content": "fun event yay",
        "date": "2004-10-19",
        "time": "10:23:54",
        "user_id": "3"
     }
 * "address" can be substituted with "address_id: {Integer}" in which case the existing address is reused.
 * @returns:
 *  status: 200, description: The event object created with it's id and address_id set to the ones stored in the database
 *  status: 400, description: User has reached their monthly event creation limit.
 *  status: 500, description: DB error
 */
router.post('/', async (req, res) => {
    try {
        const event = req.body;
        const isIndividual = await util.isIndividual(event.user_id);
        if (isIndividual) {
            const existingUserEvents = await eventRepository.findAllByUserId(event.user_id);
            if (existingUserEvents.rows.length >= 3) {
                return res.status(400).send("Event creation limit reached; user has already created 3 events this month.");
            }
        }

        if (!req.body.address_id) { // address doesn't exist in database yet
            const addressResult = await addressRepository.insert(event.address);
            event.address_id = addressResult.rows[0].id;
        }

        const eventResult = await eventRepository.insert(event);
        res.status(200).send(eventResult.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

/**
 * Endpoint called whenever a user updates an event.
 * URL example: POST http://localhost:8000/event/update/5
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 {
        "address": {
            "id": "5",
            "address_1": "Line 1",
            "address_2": "Line 2",
            "postcode": "14 aa",
            "city": "LDN",
            "region": "LDN again",
            "lat": "0.3",
            "long": "100.50"
        },
        "name": "event",
        "women_only": "true",
        "spots": "3",
        "address_visible": "true",
        "minimum_age": "16",
        "photo_id": "true",
        "physical": "true",
        "add_info": "true",
        "content": "fun event yay",
        "date": "2004-10-19",
        "time": "10:23:54",
        "user_id": "3"
     }
 * Note that address must have an id.
 * @returns:
 *  status: 200, description: The event object updated event object.
 *  status: 500, description: DB error
 */
router.post('/update/:id', (req, res) => {
    const address = req.body.address;
    const event = req.body;
    event.address_id = address.id;
    event.id = req.params.id;
    addressRepository.update(address)
        .then(addressResult => eventRepository.update(event))
        .then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});

/**
 * Endpoint called whenever a user requests information about an event.
 * URL example: GET http://localhost:8000/event/5
 * @param {Integer} id - id of requested event.
 * @returns:
 *  status: 200, description: Information regarding the event containing the same properties as this example:
 {
    "id": 7,
    "name": "event",
    "address_id": 24,
    "women_only": true,
    "spots": 3,
    "address_visible": true,
    "minimum_age": 16,
    "photo_id": true,
    "physical": true,
    "add_info": true,
    "content": "fun event yay",
    "date": "2004-10-19T09:23:54.000Z",
    "user_id": 27,
    "address": {
        "id": 24,
        "address_1": "221B Baker St",
        "address_2": "Marleybone",
        "postcode": "NW1 6XE",
        "city": "London",
        "region": "Greater London",
        "lat": "51.5237740",
        "long": "-0.1585340"
    }
}
 *  status: 500, description: DB error
 */
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const eventResult = await eventRepository.findById(id);
        const event = eventResult.rows[0];
        const addressResult = await addressRepository.findById(event.address_id);
        const address = addressResult.rows[0];
        res.status(200).send({...event, address: address});
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

/**
 * get called when causes tab is pressed in main page
 * returns all causes selected by user
 * url example: http://localhost:8000/event/causes?id=2
 */
/**
 * route {GET} event/causes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.id - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects that have user selected causes
 *  status: 400, description: if ID param is not specified or in wrong format/NaN
 *  status: 500, description: Most probably a database error occured
 */
router.get('/causes', (req, res) => {
    const id = req.query.id;
    if (!id) return res.status(400).send("No user id was specified in the query");
    if (isNaN(id)) return res.status(400).send("ID specified is in wrong format");
    causeRepository.getAllSelectedByUser(id)
        .then(result => {
            if (result.rows.length == 0) return res.status(404).send("No causes selected by user");
            res.status(200).json(result.rows);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
