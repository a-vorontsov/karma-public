/**
 * @module Event-signup
 */

const express = require('express');
const router = express.Router();
const eventRepository = require("../models/databaseRepositories/eventRepository");
const signupRepository = require("../models/databaseRepositories/signupRepository");

/**
 * Endpoint called whenever a user wishes to sign up to an event.<br/>
 * URL example: POST http://localhost:8000/event/5/signUp
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individual_id": "3",
    "confirmed": "true"
  }
 </pre>
 * @returns
 *  status: 200, description: The signup object created <br/>
 *  status: 500, description: DB error
 *  @name Sign up to event
 *  @function
 */
router.post('/:event_id/signUp', async (req, res) => {
    try {
        const event_id = req.params.event_id;
        const signupRequest = req.body;
        signupRequest.event_id = event_id;
        const signupResult = await signupRepository.insert(signupRequest);
        res.status(200).send(signupResult);
    } catch (e) {
        console.log("Error while creating signup: " + e.message);
        res.status(500).send({message: e.message});
    }
});

/**
 * Endpoint called whenever a user wishes to all events they have signed up to.<br/>
 * URL example: GET http://localhost:8000/event/signUp/history
 * @param {Event} req.body - id of individual requesting their signup history:
 <pre>
 {
    "individual_id": "3"
  }
 </pre>
 * @returns
 *  status: 200, description: The signup object created<br/>
 *  status: 500, description: DB error
 *  @name See signup history
 *  @function
 */
router.get('/signUp/history', async (req, res) => {
    try {
        const individual_id = req.body.individual_id;
        const signups = await signupRepository.findAllByIndividualId(individual_id);
        const signedUpEvents = signups.rows.map(s => s.event_id)
            .map(async e => await eventRepository.findById(e));
        res.status(200).send(signedUpEvents);
    } catch (e) {
        console.log("Error while creating signup: " + e.message);
        res.status(500).send({message: e.message});
    }
});

/**
 * Endpoint called whenever a user updates their attendance confirmation in an event.<br/>
 * URL example: POST http://localhost:8000/event/5/signUp/update
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individual_id": "3",
    "confirmed": "false"
  }
 </pre>
 * @returns
 *  status: 200, description: The signup object updated<br/>
 *  status: 500, description: DB error
 *  @name Update signup status for event
 *  @function
 */
router.post('/:event_id/signUp/update', async (req, res) => {
    try {
        const event_id = req.params.event_id;
        const signupRequest = req.body;
        signupRequest.event_id = event_id;
        const signupResult = await signupRepository.update(signupRequest);
        res.status(200).send(signupResult);
    } catch (e) {
        console.log("Error while updating signup: " + e.message);
        res.status(500).send({message: e.message});
    }
});


module.exports = router;
