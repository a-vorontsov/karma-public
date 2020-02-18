const express = require('express');
const router = express.Router();
const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");


router.post('/', (req, res) => {
    const address = req.body.address;
    let eventPromise;
    if (!req.body.address_id) {// address doesn't exist in database yet
        eventPromise = addressRepository.insert(address)
            .then(addressResult => {
                const event = {...req.body, address_id: addressResult.rows[0].id};
                return eventRepository.insert(event);
            });
    } else {
        eventPromise = eventRepository.insert(req.body);
    }
    eventPromise.then(eventResult => res.status(200).send(eventResult.rows[0]));
});

router.post('/update', (req, res) => {
    const address = req.body.address;
    const event = req.body;
    addressRepository.update(address)
        .then(addressResult => eventRepository.update(event))
        .then(eventResult => res.status(200).send(eventResult.rows[0]));
});


module.exports = router;
