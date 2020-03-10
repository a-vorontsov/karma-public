/**
 * @module Event-Signup
 */

const express = require('express');
const router = express.Router();
const eventRepository = require("../../../models/databaseRepositories/eventRepository");
const signupRepository = require("../../../models/databaseRepositories/signupRepository");
const util = require("../../../util/util");

/**
 * Endpoint called whenever a user wishes to sign up to an event.<br/>
 * URL example: POST http://localhost:8000/event/5/signUp
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individualId": "3",
    "confirmed": "true"
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: The signup object created <br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "signup": {
            "individualId": 7,
            "eventId": 11,
            "confirmed": true
        }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @name Sign up to event
 *  @function
 */
router.post('/:eventId/signUp', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const signupRequest = req.body;
        signupRequest.eventId = eventId;
        const signupResult = await signupRepository.insert(signupRequest);
        res.status(200).send({message: "Signed up for event successfully", data: {signup: signupResult.rows[0]}});
    } catch (e) {
        console.log("Error while creating signup: " + e.message);
        res.status(500).send({
            message: e.message,
        });
    }
});

/**
 * Endpoint called to get all users signed up to an event.<br/>
 * URL example: GET http://localhost:8000/event/1/signUp
 * @param {Number} req.params.eventId - id of the event.
 * @returns {object}
 *  status: 200, description: Array of all users signed up with necessary details named users<br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "users": [
            {
                "id": 7,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
            {
                "id": 7,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
        ]
    }
 }
 </pre>
 *  status: 400, description: Event id not specified or specified in wrong format<br/>
 *  status: 404, description: No event with id specified found or no users signed up<br/>
 *  status: 500, description: DB error
 *  @name See signed up users
 *  @function
 */
router.get('/:eventId/signUp', async (req, res) => {
    const eventId = req.params.eventId;
    const checkEventIdResult = await util.checkEventId(eventId);
    if (checkEventIdResult.status !== 200) {
        return res.status(checkEventIdResult.status).send({message: checkEventIdResult.message});
    }
    signupRepository.findUsersSignedUp(eventId)
        .then(result => {
            if (result.rows.length === 0) return res.status(404).send({message: "No users signed up for this event"});
            res.status(200).send({message: "Signed up users fetched successfully", data: {users: result.rows}});
        })
        .catch(err => res.status(500).send({message: err.message}));
});

/**
 * Endpoint called whenever a user wishes to see all events they have signed up to.<br/>
 * URL example: GET http://localhost:8000/event/signUp/history
 * @param {Event} req.body - id of individual requesting their signup history:
 <pre>
 {
    "individualId": "3"
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: Array of all events the user has signed up to<br/>
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
 *  status: 500, description: DB error
 *  @name See signup history
 *  @function
 */
router.get('/signUp/history', async (req, res) => {
    try {
        const individualId = req.body.individualId;
        const signups = await signupRepository.findAllByIndividualId(individualId);
        const signedUpEvents = signups.rows.map(s => s.eventId)
            .map(async e => await eventRepository.findById(e));
        res.status(200).send({message: "History fetched successfully", data: {events: signedUpEvents.rows}});
    } catch (e) {
        console.log("Error while creating signup: " + e.message);
        res.status(500).send({
            message: e.message,
        });
    }
});

/**
 * Endpoint called whenever a user updates their attendance confirmation in an event.<br/>
 * URL example: POST http://localhost:8000/event/5/signUp/update
 * @param {Event} req.body - Information regarding the event containing the same properties as this example:
 <pre>
 {
    "individualId": "3",
    "confirmed": "false"
  }
 </pre>
 * @returns {Object}
 *  status: 200, description: The signup object updated<br/>
 <pre>
 {
    "message": "Favourite added successfully",
    "data": {
        "signup": {
            "individualId": 7,
            "eventId": 11,
            "confirmed": true
        }
    }
 }
 </pre>
 *  status: 500, description: DB error
 *  @name Update signup status for event
 *  @function
 */
router.post('/:eventId/signUp/update', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const signupRequest = req.body;
        signupRequest.eventId = eventId;
        const signupResult = await signupRepository.update(signupRequest);
        res.status(200).send({message: "Signup updated successfully", data: {signup: signupResult.rows[0]}});
    } catch (e) {
        console.log("Error while updating signup: " + e.message);
        res.status(500).send({
            message: e.message,
        });
    }
});


module.exports = router;
