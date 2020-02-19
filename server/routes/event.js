const express = require('express');
const router = express.Router();
const distanceCalculator = require('../distanceCalculator');
const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");
const causeRepository = require("../models/causeRepository");
const userRepository = require("../models/userRepository");

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

router.get('/', (req, res) => {
    const user = userRepository.getUserLocation(1)
        .then(result => console.log(result.rows))
        .catch(err => console.log(err));
    eventRepository.getEventsWithLocation()
        .then(result => {
            if (result.rows.length == 0) return res.status(404).send("No events");
            res.status(200).json(result.rows);
        })
        // eventRepository.getAll()
        //     .then(result => res.status(200).json(result.rows))
        .catch(err => res.status(500).send(err));
});
/**
 * get called when causes tab is pressed in main page
 * returns all causes selected by user
 * url example: http://localhost:8000/event/causes?id=2
 */
router.get('/causes', (req, res) => {
    const id = req.query.id;
    if (!id) {
        return res.status(400).send("No user id was specified in the query");
    }
    causeRepository.getAllSelectedByUser(id)
        .then(result => {
            if (result.rows.length == 0) return res.status(404).send("No causes selected by user");
            res.status(200).json(result.rows);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
