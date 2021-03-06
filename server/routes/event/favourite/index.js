/**
 * @module Event-Favourite
 */
const log = require("../../../util/log");
const express = require('express');
const router = express.Router();
const eventFavouriteService = require("../../../modules/event/favourite");
const httpUtil = require("../../../util/http");
const util = require("../../../util");
const validation = require("../../../modules/validation");
const authService = require("../../../modules/authentication/");

/**
 * Endpoint called whenever a user wishes to favourite an event.<br/>
 <p><b>Route: </b>/event/:id/favourite (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "userId": "3"
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: The favourite object that is created<br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "favourite": {
            "individualId": 7,
            "eventId": 11,
        }
    }
}
 </pre>
 *  status: 500, description: DB error
 *  @name Favourite an event
 *  @function
 */
router.post('/:eventId/favourite', authService.requireAuthentication, async (req, res) => {
    try {
        log.info("User id '%d': Favouriting event id '%d'", req.body.userId, req.params.eventId);
        const individualId = await util.getIndividualIdFromUserId(req.body.userId);
        const favouriteRequest = {individualId, eventId: Number.parseInt(req.params.eventId)};
        const validationResult = validation.validateFavourite(favouriteRequest);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const favouriteResult = await eventFavouriteService.createEventFavourite(favouriteRequest);
        return httpUtil.sendResult(favouriteResult, res);
    } catch (e) {
        log.error("User id '%d': Favouriting event id '%d' failed: " + e, req.body.userId, req.params.eventId);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user unfavourites an event.<br/>
 <p><b>Route: </b>/event/:id/favourite/delete (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {string} req.headers.authorization authToken
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "userId": "3"
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: The favourite object deleted<br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "favourite": {
            "individualId": 7,
            "eventId": 11,
        }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @name Delete favourite status for event
 *  @function
 */
router.post('/:eventId/favourite/delete', authService.requireAuthentication, async (req, res) => {
    try {
        const individualId = await util.getIndividualIdFromUserId(req.body.userId);
        log.info("User id '%d': Unfavouriting event id '%d'", req.body.userId, req.params.eventId);
        const deleteFavouriteRequest = {individualId, eventId: Number.parseInt(req.params.eventId)};
        const validationResult = validation.validateFavourite(deleteFavouriteRequest);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const deleteFavouriteResult = await eventFavouriteService.deleteEventFavourite(deleteFavouriteRequest);
        return httpUtil.sendResult(deleteFavouriteResult, res);
    } catch (e) {
        log.error("User id '%d': Unfavouriting event id '%d' failed: " + e, req.body.userId, req.params.eventId);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
