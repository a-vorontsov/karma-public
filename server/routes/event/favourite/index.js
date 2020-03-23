/**
 * @module Event-Favourite
 */

const express = require('express');
const router = express.Router();
const eventFavouriteService = require("../../../modules/event/favourite/eventFavouriteService");
const httpUtil = require("../../../util/httpUtil");
const util = require("../../../util/util");
const validation = require("../../../modules/validation");
const authAgent = require("../../../modules/authentication/auth-agent");

/**
 * Endpoint called whenever a user wishes to favourite an event.<br/>
 <p><b>Route: </b>/event/:id/favourite (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
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
router.post('/:eventId/favourite', authAgent.requireAuthentication, async (req, res) => {
    try {
        const individualId = await util.getIndividualIdFromUserId(req.body.userId);
        const favouriteRequest = {individualId, eventId: Number.parseInt(req.params.eventId)};
        const validationResult = validation.validateFavourite(favouriteRequest);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const favouriteResult = await eventFavouriteService.createEventFavourite(favouriteRequest);
        return httpUtil.sendResult(favouriteResult, res);
    } catch (e) {
        console.log("Error while favouriting event: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user unfavourites an event.<br/>
 <p><b>Route: </b>/event/:id/favourite/delete (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
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
router.post('/:eventId/favourite/delete', authAgent.requireAuthentication, async (req, res) => {
    try {
        const individualId = await util.getIndividualIdFromUserId(req.body.userId);
        const deleteFavouriteRequest = {individualId, eventId: Number.parseInt(req.params.eventId)};
        const validationResult = validation.validateFavourite(deleteFavouriteRequest);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const deleteFavouriteResult = await eventFavouriteService.deleteEventFavourite(deleteFavouriteRequest);
        return httpUtil.sendResult(deleteFavouriteResult, res);
    } catch (e) {
        console.log("Error while unfavouriting event: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
