const express = require('express');
const router = express.Router();
const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");
const userRepository = require("../models/userRepository");
const selectedCauseRepository = require("../models/selectedCauseRepository");
const eventSorter = require("../sorting/event");
const paginator = require("../pagination");
// const querystring = require('querystring');

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
 * gets called when user is in tab all in activities homepage
 * url example : http://localhost:8000/event?userId=1
 * distance in miles
 */
router.get('/', async (req, res) => {
    const userId = req.query.userId;
    const userResult = await userRepository.getUserLocation(userId);
    const user = userResult.rows[0];
    if (!user) return res.status(400).send("No user with specified id");
    eventRepository.getEventsWithLocation()
        .then(result => {
            const events = result.rows;
            if (events.length === 0) return res.status(404).send("No events");
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(paginator.getPageData(req, events));
        })
        .catch(err => res.status(500).send(err));
});

/**
 * route {GET} event/causes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {integer} req.query.userId - ID of user logged in
 * @returns:
 *  status: 200, description: Array of all event objects that have user selected causes
 *  status: 400, description: if userID param is not specified or in wrong format/NaN
 *  status: 404, description: if userID doesnt belong to any user
 *  status: 500, description: Most probably a database error occured
 */
router.get('/causes', async (req, res) => {
    const userId = req.query.userId;

    if (!userId) return res.status(400).send("No user id was specified in the query");
    if (isNaN(userId)) return res.status(400).send("ID specified is in wrong format");

    const userResult = await userRepository.getUserLocation(userId);
    const user = userResult.rows[0];
    if (!user) return res.status(404).send("No user with specified id");
    selectedCauseRepository.findEventsSelectedByUser(userId)
        .then(result => {
            const events = result.rows;
            if (events.length === 0) return res.status(404).send("No causes selected by user");
            eventSorter.sortByTime(events);
            eventSorter.sortByDistanceFromUser(events, user);
            res.status(200).json(eventSorter.groupByCause(events));
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
