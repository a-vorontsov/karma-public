/**
 * @module Event-Signup
 */

const express = require('express');
const router = express.Router();

const eventSignupService = require("../../../modules/event/signup/eventSignupService");
const httpUtil = require("../../../util/httpUtil");
const validation = require("../../../modules/validation");

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
        const signup = {...req.body, eventId: Number.parseInt(req.params.eventId)};
        const validationResult = validation.validateSignup(signup);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const signupResult = await eventSignupService.createSignup(signup);
        return httpUtil.sendResult(signupResult, res);
    } catch (e) {
        console.log("Error while creating signup: " + e.message);
        return httpUtil.sendGenericError(e, res);
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
                "user_id": 7,
                "email": "asd@asd.asd",
                "username": "Sten"
                [...]
            }
            {
                "user_id": 8,
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
    try {
        const eventId = Number.parseInt(req.params.eventId);
        const signupsResult = await eventSignupService.getAllSignupsForEvent(eventId);
        return httpUtil.sendResult(signupsResult, res);
    } catch (e) {
        console.log("Error while fetching signups: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user wishes to see all events they have attended. This only shows past events<br/>
 * URL example: GET http://localhost:8000/event/signUp/history
 * @param {Object} req.body - id of individual requesting their signup history:
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
        if (individualId === undefined) {
            return res.send(400).body({message: "IndividualId not specified"});
        }

        const signupsResult = await eventSignupService.getSignupHistory(individualId);
        return httpUtil.sendResult(signupsResult, res);
    } catch (e) {
        console.log("Error while fetching signup history: " + e.message);
        return httpUtil.sendGenericError(e, res);
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
        const signup = {...req.body, eventId: Number.parseInt(req.params.eventId)};
        const validationResult = validation.validateSignup(signup);
        if (validationResult.errors.length > 0) {
            return httpUtil.sendValidationErrors(validationResult, res);
        }

        const signupsResult = await eventSignupService.updateSignUp(signup);
        return httpUtil.sendResult(signupsResult, res);
    } catch (e) {
        console.log("Error while updating signup: " + e.message);
        return httpUtil.sendGenericError(e, res);
    }
});


module.exports = router;
