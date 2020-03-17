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

const eventRepository = require("../../models/databaseRepositories/eventRepository");
const paginator = require("../../modules/pagination");
const util = require("../../util/util");
const eventSorter = require("../../modules/sorting/event");

router.use("/", eventSignupRoute);
router.use("/", eventFavouriteRoute);
router.use("/", eventSelectRoute);


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
  message:"All activities successfully fetched",
  "data": {
       "meta": {
         "currentPage": 2,
           "pageCount": 1,
           "pageSize": 2,
           "count": 4
       },
       "events": [
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
 }
 </pre>
 *  status: 400, description: if userID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: if userID doesn't belong to any user <br/>
 *  status: 500, description: Most probably a database error occurred
 *  @function
 *  @name Get "All" Activities tab
 */
router.get("/", async (req, res) => {
    // const userId = req.query.userId;
    // const filters = req.query.filter;
    // console.log(req.query);
    // const maxDistance = req.query.maxDistance;
    // const availabilityStart = req.query.availabilityStart;
    // const availabilityEnd = req.query.availabilityEnd;
    // filters.push(maxDistance?{maxDistance: maxDistance}:null,
    // availabilityStart?{availabilityStart: availabilityStart}:null, availabilityEnd?{availabilityEnd: availabilityEnd}:null);
    // console.log(filters);
    // console.log(maxDistance + " " + " from: " + availabilityStart +" to: " + availabilityEnd);
    try {
        const userId = Number.parseInt(req.query.userId);
        const filters = req.query.filter;
        console.log(req.query);
        const maxDistance = req.query.maxDistance;
        const availabilityStart = req.query.availabilityStart;
        const availabilityEnd = req.query.availabilityEnd;
        const getEventsResult = await eventService.getEvents(filters, userId);
        getEventsResult.data = paginator.getPageData(req, getEventsResult.data.events);
        return httpUtil.sendResult(getEventsResult, res);
    } catch (e) {
        console.log("Events fetching failed for user with id: '" + req.query.userId + "' : " + e);
        return httpUtil.sendGenericError(e, res);
    }

    // const checkUserIdResult = await util.checkUserId(userId);
    // if (checkUserIdResult.status !== 200) {
    //     return res.status(checkUserIdResult.status).send({message: checkUserIdResult.message});
    // }
    // const user = checkUserIdResult.user;
    // eventRepository
    //     .getEventsWithLocation(filters)
    //     .then(result => {
    //         const events = result.rows;
    //         if (events.length === 0) return res.status(404).send({message: "No events"});
    //         eventSorter.sortByTime(events);
    //         eventSorter.sortByDistanceFromUser(events, user);
    //         res.status(200).send({
    //             message: "Events fetched successfully",
    //             data: paginator.getPageData(req, events),
    //         });
    //     })
    //     .catch(err => res.status(500).send({message: err.message}));
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


module.exports = router;
