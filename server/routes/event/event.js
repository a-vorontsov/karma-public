const express = require("express");
const router = express.Router();
const addressRepository = require("../../models/addressRepository");
const eventRepository = require("../../models/eventRepository");
const util = require("../../util/util");
const selectedCauseRepository = require("../../models/selectedCauseRepository");
const individualRepository = require("../../models/individualRepository");
const eventSorter = require("../../modules/sorting/event");
const paginator = require("../../modules/pagination");
const eventSignupRoute = require("../eventSignup");
const querystring = require('querystring');

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
router.post("/", async (req, res) => {
    try {
        const event = req.body;
        const isIndividual = await util.isIndividual(event.user_id);
        if (isIndividual) {
            const existingUserEvents = await eventRepository.findAllByUserId(
                event.user_id,
            );
            if (existingUserEvents.rows.length >= 3) {
                return res
                    .status(400)
                    .send(
                        "Event creation limit reached; user has already created 3 events this month.",
                    );
            }
        }

        if (!req.body.address_id) {
            // address doesn't exist in database yet
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
router.post("/update/:id", (req, res) => {
    const address = req.body.address;
    const event = req.body;
    event.address_id = address.id;
    event.id = req.params.id;
    addressRepository
        .update(address)
        .then(addressResult => eventRepository.update(event))
        .then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});


/**
 * endpoint called when "All" tab is pressed in Activities homepage
 * URL example: http://localhost:8000/event?userId=1&currentPage=1&pageSize=2
 * route {GET} /event
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects sorted by time
 *  and distance from the user (distance measured in miles), along with pagination information as follows:
 * {
 *  "meta": {
 *     "currentPage": 2,
 *       "pageCount": 1,
 *       "pageSize": 2,
 *       "count": 4
 *   },
 *   "data": [
 *       {
 *           "event_id": 1,
 *           "name": "Community help centre",
 *           "women_only": false,
 *           "spots": 3,
 *           "address_visible": true,
 *           "minimum_age": 18,
 *           "photo_id": false,
 *           "physical": false,
 *           "add_info": true,
 *           "content": "help people at the community help centre because help is good",
 *           "date": "2020-03-25T19:10:00.000Z",
 *           "event_creator_id": 1,
 *           "address_1": "nearby road",
 *           "address_2": null,
 *           "postcode": "whatever",
 *           "city": "London",
 *           "region": null,
 *           "lat": "51.4161220",
 *           "long": "-0.1866410",
 *            "distance": 0.18548890708299523
 *       },
 *       {
 *           "event_id": 2,
 *           "name": "Picking up trash",
 *           "women_only": false,
 *           "spots": 5,
 *           "address_visible": true,
 *           "minimum_age": 18,
 *           "photo_id": false,
 *           "physical": false,
 *           "add_info": true,
 *           "content": "small class to teach other people how to pick themselves up",
 *           "date": "2020-03-25T19:10:00.000Z",
 *           "event_creator_id": 1,
 *           "address_1": "uni road",
 *           "address_2": null,
 *           "postcode": "whatever",
 *           "city": "London",
 *           "region": null,
 *           "lat": "51.5114070",
 *           "long": "-0.1159050",
 *           "distance": 7.399274608089304
 *       }
 *   ]
 * }
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const filters = req.query.filter;

    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status != 200) {
        return res.status(checkUserIdResult.status).send(checkUserIdResult.message);
    }
    const user = checkUserIdResult.user;
    eventRepository
        .getEventsWithLocation(filters)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) return res.status(404).send("No events");
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(paginator.getPageData(req, events));
        })
        .catch(err => res.status(500).send(err));
});

/**
 * route {GET} event/causes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects grouped by causes that were selected by user
 *  Each cause group is sorted by time and distance from the user (distance measured in miles) as follows:
 * {
    "peace": [
        {
            "id": 3,
            "name": "Staying at Home",
            "address_id": 1,
            "women_only": false,
            "spots": 1,
            "address_visible": true,
            "minimum_age": 18,
            "photo_id": false,
            "add_info": false,
            "content": "sleeping at home",
            "date": "2020-03-25T19:10:00.000Z",
            "cause_id": 3,
            "cause_name": "peace",
            "cause_description": "not dealing with people",
            "event_creator_id": 1,
            "address_1": "pincot road",
            "address_2": null,
            "postcode": "SW19 2LF",
            "city": "London",
            "region": null,
            "lat": "51.4149160",
            "long": "-0.1904870",
            "distance": 0
        }
    ],
    "gardening": [
        {
            "id": 1,
            "name": "Close to Home",
            "address_id": 3,
            "women_only": false,
            "spots": 3,
            "address_visible": true,
            "minimum_age": 18,
            "photo_id": false,
            "add_info": false,
            "content": "very very close from home",
            "date": "2020-03-25T19:10:00.000Z",
            "cause_id": 1,
            "cause_name": "gardening",
            "cause_description": "watering plants and dat",
            "event_creator_id": 1,
            "address_1": "nearby road",
            "address_2": null,
            "postcode": "whatever",
            "city": "London",
            "region": null,
            "lat": "51.4161220",
            "long": "-0.1866410",
            "distance": 0.18548890708299523
        }
    ]
}
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get("/causes", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status != 200) {
        return res.status(checkUserIdResult.status).send(checkUserIdResult.message);
    }
    const user = checkUserIdResult.user;
    selectedCauseRepository
        .findEventsSelectedByUser(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) {
                return res.status(404).send("No causes selected by user");
            }
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(eventSorter.groupByCause(events));
        })
        .catch(err => res.status(500).send(err));
});

/**
 * route {GET} event/favourites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects favourited by the user
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get("/favourites", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status != 200) {
        return res.status(checkUserIdResult.status).send(checkUserIdResult.message);
    }
    const user = checkUserIdResult.user;
    individualRepository
        .findFavouriteEvents(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) {
                return res.status(404).send("No events favourited by user");
            }
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(events);
        })
        .catch(err => res.status(500).send(err));
});

/**
 * route {GET} event/going
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects that user is going to
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get("/going", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status != 200) {
        return res.status(checkUserIdResult.status).send(checkUserIdResult.message);
    }
    const user = checkUserIdResult.user;
    individualRepository
        .findGoingEvents(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) {
                return res.status(404).send("User not going to any events");
            }
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(events);
        })
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
        res.status(200).send({
            ...event,
            address: address,
        });
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
    }
});

router.use("/", eventSignupRoute);

module.exports = router;
