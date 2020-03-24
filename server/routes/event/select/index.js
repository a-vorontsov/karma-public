/**
 * @module Event-Select
 */
const log = require("../../../util/log");
const express = require('express');
const router = express.Router();
const httpUtil = require("../../../util/httpUtil");
const eventService = require("../../../modules/event/eventService");
const eventFavouriteService = require("../../../modules/event/favourite/eventFavouriteService");
const eventSignupService = require("../../../modules/event/signup/eventSignupService");
const authAgent = require("../../../modules/authentication/");

/**
 * Endpoint called when "Causes" tab is pressed in Activities homepage<br/>
 * URL example: http://localhost:8000/event/causes?filter[]=!womenOnly&filter[]=physical
 <p><b>Route: </b>/event/causes (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
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
router.get("/causes", authAgent.requireAuthentication, async (req, res) => {
    try {
        const userId = Number.parseInt(req.query.userId);
        log.info("Getting 'Causes' tab for %d", userId);
        const filters = {booleans: req.query.filter};
        filters.availabilityStart = req.query.availabilityStart;
        filters.availabilityEnd = req.query.availabilityEnd;
        filters.maxDistance = req.query.maxDistance;
        const getEventsResult = await eventService.getEventsBySelectedCauses(filters, userId);
        return httpUtil.sendResult(getEventsResult, res);
    } catch (e) {
        log.error("'Causes' tab fetching failed for user with id: '" + req.query.userId + "' : " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called when "Favourites" tab is pressed in Activities homepage <br/>
 <p><b>Route: </b>/event/favourites (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
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
router.get("/favourites", authAgent.requireAuthentication, async (req, res) => {
    try {
        const userId = Number.parseInt(req.query.userId);
        log.info("Getting 'Favourites' tab for %d", userId);
        const getFavouriteEventsResult = await eventFavouriteService.getFavouriteEvents(userId);
        return httpUtil.sendResult(getFavouriteEventsResult, res);
    } catch (e) {
        log.error("Favourite events fetching failed for user with id: '" + req.query.userId + "' : " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called when "Going" tab is pressed in Activities homepage <br/>
 <p><b>Route: </b>/event/going (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
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
router.get("/going", authAgent.requireAuthentication, async (req, res) => {
    try {
        const userId = Number.parseInt(req.query.userId);
        log.info("Getting 'Going' tab for %d", userId);
        const getGoingEventsResult = await eventSignupService.getGoingEvents(userId);
        return httpUtil.sendResult(getGoingEventsResult, res);
    } catch (e) {
        log.error("Going events fetching failed for user with id: '" + req.query.userId + "' : " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
