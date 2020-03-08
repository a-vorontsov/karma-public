/**
 * @module Select-Event
 */

const express = require('express');
const router = express.Router();
const eventRepository = require("../../../models/databaseRepositories/eventRepository");
const util = require("../../../util/util");
const selectedCauseRepository = require("../../../models/databaseRepositories/selectedCauseRepository");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");
const eventSorter = require("../../../modules/sorting/event");
const paginator = require("../../../modules/pagination");


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
 *  status: 404, description: if userID doesnt belong to any user <br/>
 *  status: 500, description: Most probably a database error occurred
 *  @function
 *  @name Get "All" Activities tab
 */
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const filters = req.query.filter;
    const checkUserIdResult = await util.checkUserId(userId);
    if (checkUserIdResult.status !== 200) {
        return res.status(checkUserIdResult.status).send({message: checkUserIdResult.message});
    }
    const user = checkUserIdResult.user;
    eventRepository
        .getEventsWithLocation(filters)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) return res.status(404).send({message: "No events"});
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).send({
                message: "Events fetched successfully",
                data: paginator.getPageData(req, events),
            })
        })
        .catch(err => res.status(500).send({message: err.message}));
});

/**
 * Endpoint called when "Causes" tab is pressed in Activities homepage<br/>
 * route {GET} event/causes
 * URL example: http://localhost:8000/event/causes?userId=1&filter[]=!womenOnly&filter[]=physical
 * @param {Number} req.query.userId - ID of user logged in
 * @param {Array} req.query.filter - all filters required as an array of strings
 * @returns {any}
 *  status: 200, description: Array of all event objects grouped by causes that were selected by user <br/>
 *  Each cause group is sorted by time and distance from the user (distance measured in miles) as follows:
 *  <pre>
 {
    message: "Events fetched successfully",
    data: {
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
        return res.status(checkUserIdResult.status).send({message: checkUserIdResult.message});
    }
    const user = checkUserIdResult.user;
    selectedCauseRepository
        .findEventsSelectedByUser(userId, filters)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) {
                return res.status(404).send({message: "No causes selected by user"});
            }
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).send({
                message: "Events fetched successfully",
                data: eventSorter.groupByCause(events)
            });
        })
        .catch(err => res.status(500).send({message: err.message}));
});

/**
 * Endpoint called when "Favourites" tab is pressed in Activities homepage <br/>
 * route {GET} event/favourites
 * @param {Number} req.query.userId - ID of user logged in
 * @returns
 *  status: 200, description: res.data: Array of all event objects favourited by the user named 'events'<br/>
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
                return res.status(404).send({message:"No events favourited by user"});
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
 * @returns
 *  status: 200, description: Array of all event objects that user is going to named 'events'<br/>
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
