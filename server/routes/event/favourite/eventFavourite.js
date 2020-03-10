/**
 * @module Favourite-Event
 */

const express = require('express');
const router = express.Router();
const favouriteRepository = require("../../../models/databaseRepositories/favouriteRepository");

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
        const eventId = req.params.eventId;
        const favouriteRequest = req.body;
        favouriteRequest.eventId = eventId;
        const favouriteResult = await favouriteRepository.insert(favouriteRequest);
        res.status(200).send({message: "Favourite added successfully", data: {favourite: favouriteResult.rows[0]}});
    } catch (e) {
        console.log("Error while favouriting event: " + e.message);
        res.status(500).send({message: e.message});
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
        const eventId = req.params.eventId;
        const favouriteRequest = req.body;
        favouriteRequest.eventId = eventId;
        const favouriteResult = await favouriteRepository.remove(favouriteRequest);
        res.status(200).send({message: "Event unfavourited successfully", data: {favourite: favouriteResult.rows[0]}});
    } catch (e) {
        console.log("Error while updating favourite: " + e.message);
        res.status(500).send({message: e.message});
    }
});


module.exports = router;
