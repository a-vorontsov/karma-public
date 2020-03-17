/**
 * @module Event-Select
 */

const express = require('express');
const router = express.Router();

const util = require("../../../util/util");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");
const eventSorter = require("../../../modules/sorting/event");
const httpUtil = require("../../../util/httpUtil");
const eventService = require("../../../modules/event/eventService");

/**
 * Endpoint called when "Causes" tab is pressed in Activities homepage<br/>
 * route {GET} event/causes
 * URL example: http://localhost:8000/event/causes?userId=1&filter[]=!womenOnly&filter[]=physical
 * @param {Number} req.query.userId - ID of user logged in
 * @param {Array} req.query.filter - OPTIONAL: all boolean filters required as an array of strings
 * @param {Object} req.query.maxDistance - OPTIONAL: maximum distance from the user filter(inclusive)
 * @param {Object} req.query.availabilityStart - OPTIONAL: when user is first available filter(inclusive)
 * @param {Object} req.query.availabilityEnd - OPTIONAL: when user is last available filter(inclusive)
 * @returns {Object}
 *  status: 200, description: Array of all event objects grouped by causes that were selected by user <br/>
 *  Each cause group is sorted by time and distance from the user (distance measured in miles) as follows:
 *  <pre>
{
    "message": "Events fetched successfully",
    "data": {
        "peace": [
            {
                "id": 3,
                "name": "Event in KCL",
                "addressId": 3,
                "womenOnly": false,
                "spotsAvailable": 30,
                "addressVisible": true,
                "minimumAge": 20,
                "photoId": false,
                "physical": true,
                "addInfo": true,
                "content": "nunc sit amet metus. Aliquam erat volutpat. Nulla facili",
                "date": "2020-04-08T23:00:00.000Z",
                "causeId": 6,
                "causeName": "peace",
                "causeDescription": "montes, nascetur ridiculus mus. Aenean",
                "eventCreatorId": 1,
                "address1": "uni road",
                "address2": "wherever",
                "postcode": "SE1 1DR",
                "city": "London",
                "region": "region",
                "lat": 51.511407,
                "long": -0.115905,
                "volunteers": [
                    1,
                    34
                ],
                "going": true,
                "spotsRemaining": 28,
                "distance": 7.399274608089304
            }
        ],
        "animals": [
            {
                "id": 47,
                "name": "consectetuer, cursus et, magna. Praesent",
                "addressId": 15,
                "womenOnly": false,
                "spotsAvailable": 4,
                "addressVisible": true,
                "minimumAge": 20,
                "photoId": false,
                "physical": true,
                "addInfo": false,
                "content": "ullamcorper eu, euismod ac, fermentum vel, mauris.",
                "date": "2020-01-22T00:00:00.000Z",
                "causeId": 1,
                "causeName": "animals",
                "causeDescription": "Morbi accumsan laoreet ipsum. Curabitur",
                "eventCreatorId": 13,
                "address1": "5296 Nulla Av.",
                "address2": "982-9169 Ante Road",
                "postcode": "18258",
                "city": "Carovilli",
                "region": "MOL",
                "lat": -84,
                "long": 10,
                "volunteers": [],
                "going": false,
                "spotsRemaining": 4,
                "distance": 9361.620275789797
            }
        ]
    }
}
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "Causes" Activites tab
 *  */
router.get("/causes", async (req, res) => {
    try {
        const userId = Number.parseInt(req.query.userId);
        const filters = {booleans: req.query.filter};
        filters.availabilityStart = req.query.availabilityStart;
        filters.availabilityEnd = req.query.availabilityEnd;
        filters.maxDistance = req.query.maxDistance;
        const getEventsResult = await eventService.getEventsBySelectedCauses(filters, userId);
        return httpUtil.sendResult(getEventsResult, res);
    } catch (e) {
        console.log("Events fetching failed for user with id: '" + req.query.userId + "' : " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called when "Favourites" tab is pressed in Activities homepage <br/>
 * route {GET} event/favourites
 * @param {Number} req.query.userId - ID of user logged in
 * @returns {Object}
 *  status: 200, description: res.data: Array of all event objects favourited by the user<br/>
 <pre>
 {
  message:"All activities successfully fetched",
  "data": {
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
 *  status: 404, description: if userID doesnt belong to any user <br/>
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "Favourites" Activites tab
 *  */
router.get("/favourites", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
        return res.status(checkUserIdResult.status).send({message: checkUserIdResult.message});
    }
    const user = checkUserIdResult.user;
    individualRepository
        .findFavouriteEvents(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) {
                return res.status(404).send({message: "No events favourited by user"});
            }
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).send({message: "Events fetched successfully", data: {events: events}});
        })
        .catch(err => res.status(500).send({message: err.message}));
});

/**
 * Endpoint called when "Going" tab is pressed in Activities homepage <br/>
 * route {GET} event/going
 * @param {Number} req.query.userId - ID of user logged in
 * @returns {Object}
 *  status: 200, description: Array of all event objects that user is going to<br/>
 <pre>
 {
  message:"All activities successfully fetched",
  "data": {
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
 *  status: 404, description: if userID doesnt belong to any user <br/>
 *  status: 500, description: Most probably a database error occured
 *  @function
 *  @name Get "Going" Activites tab
 *  */
router.get("/going", async (req, res) => {
    const userId = req.query.userId;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
        return res.status(checkUserIdResult.status).send({message: checkUserIdResult.message});
    }
    const user = checkUserIdResult.user;
    individualRepository
        .findGoingEvents(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) {
                return res.status(404).send({message: "User not going to any events"});
            }
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).send({message: "Events fetched successfully", data: {events: events}});
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
