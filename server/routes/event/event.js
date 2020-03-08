/**
 * @module Events
 */

const express = require("express");
const router = express.Router();
const addressRepository = require("../../models/databaseRepositories/addressRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");
const util = require("../../util/util");
const selectedCauseRepository = require("../../models/databaseRepositories/selectedCauseRepository");
const individualRepository = require("../../models/databaseRepositories/individualRepository");
const eventSorter = require("../../modules/sorting/event");
const paginator = require("../../modules/pagination");
const eventSignupRoute = require("../eventSignup");
const eventFavouriteRoute = require("../eventFavourite");
const validation = require("../../modules/validation");

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
            res.status(400).send(validationResult.errors);
            return;
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
                        "Event creation limit reached; user has already created 3 events this month.",
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
        res.status(200).send(eventResult.rows[0]);
    } catch (e) {
        console.log(e);
        res.status(500).send(e);
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
 * @returns
 *  status: 200, description: The event object updated event object.<br/>
 *  status: 500, description: DB error
 *  @function
 *  @name Update event
 */
router.post("/update/:id", (req, res) => {
    const address = req.body.address;
    const event = req.body;
    const validationResult = validation.validateEvent(event);
    if (validationResult.errors.length !== 0) {
        res.status(400).send(validationResult.errors);
        return;
    }

    event.addressId = address.id;
    event.id = req.params.id;
    addressRepository
        .update(address)
        .then(_ => eventRepository.update(event))
        .then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});


/**
 * Endpoint called when "All" tab is pressed in Activities homepage<br/>
 * URL example: http://localhost:8000/event?userId=1&currentPage=1&pageSize=2&filter[]=!womenOnly&filter[]=physical<br/>
 * route {GET} /event
 * @param {Number} req.query.userId - ID of user logged in
 * @param {Array} req.query.filter - all filters required as an array of strings
 * @returns {Object}
 *  status: 200, description: Array of all event objects sorted by time
 *  and distance from the user (distance measured in miles), along with pagination information as follows:
 <pre>
 {
  "meta": {
     "currentPage": 2,
       "pageCount": 1,
       "pageSize": 2,
       "count": 4
   },
   "data": [
       {
           "eventId": 1,
           "name": "Community help centre",
           "womenOnly": false,
           "spots": 3,
           "addressVisible": true,
           "minimumAge": 18,
           "photoId": false,
           "physical": false,
           "addInfo": true,
           "content": "help people at the community help centre because help is good",
           "date": "2020-03-25T19:10:00.000Z",
           "eventCreatorId": 1,
           "address1": "nearby road",
           "address2": null,
           "postcode": "whatever",
           "city": "London",
           "region": null,
           "lat": 51.4161220,
           "long": -0.1866410,
            "distance": 0.18548890708299523
       },
       {
           "eventId": 2,
           "name": "Picking up trash",
           "womenOnly": false,
           "spots": 5,
           "addressVisible": true,
           "minimumAge": 18,
           "photoId": false,
           "physical": false,
           "addInfo": true,
           "content": "small class to teach other people how to pick themselves up",
           "date": "2020-03-25T19:10:00.000Z",
           "eventCreatorId": 1,
           "address1": "uni road",
           "address2": null,
           "postcode": "whatever",
           "city": "London",
           "region": null,
           "lat": 51.5114070,
           "long": -0.1159050,
           "distance": 7.399274608089304
       }
   ]
 }
 </pre>
 *  status: 400, description: if userID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: if userID doesnt belong to any user <br/>
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "All" Activites tab
 */
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const filters = req.query.filter;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
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
 * Endpoint called when "Causes" tab is pressed in Activities homepage<br/>
 * route {GET} event/causes
 * URL example: http://localhost:8000/event/causes?userId=1&filter[]=!womenOnly&filter[]=physical
 * @param {Integer} req.query.userId - ID of user logged in
 * @param {Array} req.query.filter - all filters required as an array of strings
 * @returns {any}
 *  status: 200, description: Array of all event objects grouped by causes that were selected by user <br/>
 *  Each cause group is sorted by time and distance from the user (distance measured in miles) as follows:
 *  <pre>
{
"peace": [
        {
            "id": 3,
            "name": "Staying at Home",
            "addressId": 1,
            "womenOnly": false,
            "spots": 1,
            "addressVisible": true,
            "minimumAge": 18,
            "photoId": false,
            "addInfo": false,
            "content": "sleeping at home",
            "date": "2020-03-25T19:10:00.000Z",
            "causeId": 3,
            "causeName": "peace",
            "causeDescription": "not dealing with people",
            "eventCreatorId": 1,
            "address1": "pincot road",
            "address2": null,
            "postcode": "SW19 2LF",
            "city": "London",
            "region": null,
            "lat": 51.4149160,
            "long": -0.1904870,
            "distance": 0
        }
    ],
    "gardening": [
        {
            "id": 1,
            "name": "Close to Home",
            "addressId": 3,
            "womenOnly": false,
            "spots": 3,
            "addressVisible": true,
            "minimumAge": 18,
            "photoId": false,
            "addInfo": false,
            "content": "very very close from home",
            "date": "2020-03-25T19:10:00.000Z",
            "causeId": 1,
            "causeName": "gardening",
            "causeDescription": "watering plants and dat",
            "eventCreatorId": 1,
            "address1": "nearby road",
            "address2": null,
            "postcode": "whatever",
            "city": "London",
            "region": null,
            "lat": 51.4161220,
            "long": -0.1866410,
            "distance": 0.18548890708299523
        }
    ]
}
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "Causes" Activites tab
 *  */
router.get("/causes", async (req, res) => {
    const userId = req.query.userId;
    const filters = req.query.filter;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
        return res.status(checkUserIdResult.status).send(checkUserIdResult.message);
    }
    const user = checkUserIdResult.user;
    selectedCauseRepository
        .findEventsSelectedByUser(userId, filters)
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
 * Endpoint called when "Favourites" tab is pressed in Activities homepage <br/>
 * route {GET} event/favourites
 * @param {Integer} req.query.userId - ID of user logged in
 * @returns
 *  status: 200, description: Array of all event objects favourited by the user <br/>
 *  status: 400, description: if userID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: if userID doesnt belong to any user <br/>
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "Favourites" Activites tab
 *  */
router.get("/favourites", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
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
 * Endpoint called when "Going" tab is pressed in Activities homepage <br/>
 * route {GET} event/going
 * @param {Integer} req.query.userId - ID of user logged in
 * @returns
 *  status: 200, description: Array of all event objects that user is going to <br/>
 *  status: 400, description: if userID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: if userID doesnt belong to any user <br/>
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "Going" Activites tab
 *  */
router.get("/going", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
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
 * @returns {any}
 *  status: 200, description: Information regarding the event containing the same properties as this example
 <pre>
 {
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
            ...event,
            address: address,
        });
    } catch (e) {
        res.status(500).send(e);
    }
});

router.use("/", eventSignupRoute);
router.use("/", eventFavouriteRoute);

module.exports = router;
