/**
 * @module Favourite-Event
 */

const express = require('express');
const router = express.Router();
const favouriteRepository = require("../models/databaseRepositories/favouriteRepository");

/**
 * Endpoint called whenever a user wishes to favourite an event.<br/>
 * URL example: POST http://localhost:8000/event/5/favourite
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individual_id": "3"
  }
 </pre>
 * @returns
 *  status: 200, description: The favourite object is created <br/>
 *  status: 500, description: DB error
 *  @name Favourite an event
 *  @function
 */
router.post('/:event_id/favourite', async (req, res) => {
    try {
        const event_id = req.params.event_id;
        const favouriteRequest = req.body;
        favouriteRequest.event_id = event_id;
        const favouriteResult = await favouriteRepository.insert(favouriteRequest);
        res.status(200).send(favouriteResult);
    } catch (e) {
        console.log("Error while favouring event: " + e.message);
        res.status(500).send({message: e.message});
    }
});

/**
 * Endpoint called whenever a user unfavourites an event.<br/>
 * URL example: POST http://localhost:8000/event/5/favourite/delete
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individual_id": "3"
  }
 </pre>
 * @returns
 *  status: 200, description: The favourite object deleted<br/>
 *  status: 500, description: DB error
 *  @name Delete favourite status for event
 *  @function
 */
router.post('/:event_id/favourite/delete', async (req, res) => {
    try {
        const event_id = req.params.event_id;
        const favouriteRequest = req.body;
        favouriteRequest.event_id = event_id;
        const favouriteResult = await favouriteRepository.remove(favouriteRequest);
        res.status(200).send(favouriteResult);
    } catch (e) {
        console.log("Error while updating favourite: " + e.message);
        res.status(500).send({message: e.message});
    }
});


module.exports = router;
