/**
 * @module Favourite-Event
 */

const express = require('express');
const router = express.Router();

const eventFavouriteService = require("../../../modules/event/favourite/eventFavouriteService");
const httpUtil = require("../../../util/httpUtil");
const validation = require("../../../modules/validation");


/**
 * Endpoint called whenever a user wishes to favourite an event.<br/>
 * URL example: POST http://localhost:8000/event/5/favourite
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individualId": "3"
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
router.post('/:eventId/favourite', async (req, res) => {
    try {
        const favouriteRequest = {...req.body, eventId: Number.parseInt(req.params.eventId)};
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
 * URL example: POST http://localhost:8000/event/5/favourite/delete
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individualId": "3"
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
router.post('/:eventId/favourite/delete', async (req, res) => {
    try {
        const deleteFavouriteRequest = {...req.body, eventId: Number.parseInt(req.params.eventId)};
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
