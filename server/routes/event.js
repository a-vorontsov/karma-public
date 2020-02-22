const express = require('express');
const router = express.Router();
const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");
const selectedCauseRepository = require("../models/selectedCauseRepository");

router.post('/', (req, res) => {
    const address = req.body.address;
    let eventPromise;
    if (!req.body.address_id) { // address doesn't exist in database yet
        eventPromise = addressRepository.insert(address)
            .then(addressResult => {
                const event = {
                    ...req.body,
                    address_id: addressResult.rows[0].id,
                };
                return eventRepository.insert(event);
            });
    } else {
        eventPromise = eventRepository.insert(req.body);
    }
    eventPromise.then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});

router.post('/update', (req, res) => {
    const address = req.body.address;
    const event = req.body;
    addressRepository.update(address)
        .then(addressResult => eventRepository.update(event))
        .then(eventResult => res.status(200).send(eventResult.rows[0]))
        .catch(err => res.status(500).send(err));
});

/**
 * get called when causes tab is pressed in main page
 * returns all causes selected by user
 * url example: http://localhost:8000/event/causes?id=2
 */
/**
 * route {GET} event/causes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects that have user selected causes
 *  status: 400, description: if ID param is not specified or in wrong format/NaN
 *  status: 500, description: Most probably a database error occured
 */
router.get('/causes', (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.status(400).send("No user id was specified in the query");
    if (isNaN(userId)) return res.status(400).send("ID specified is in wrong format");
    selectedCauseRepository.findEventsSelectedByUser(userId)
        .then(result => {
            if (result.rows.length === 0) return res.status(404).send("No causes selected by user");
            res.status(200).json(result.rows);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
