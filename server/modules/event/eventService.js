const addressRepository = require("../../models/databaseRepositories/addressRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");
const signUpRepository = require("../../models/databaseRepositories/signupRepository");
const selectedCauseRepository = require("../../models/databaseRepositories/selectedCauseRepository");
const eventSorter = require("../sorting/event");
const util = require("../../util/util");
const filterer = require("../filtering");
/**
 * Creates a new event to be added to the database.
 * @param {object} event A valid event, an address inside the event object or addressId set to an existing address,
 * a valid userId inside the event object.
 * Fails if userId is invalid, user has exceeded their monthly event creation limit, or database calls fail.
 */
const createNewEvent = async (event) => {
    const userIdCheckResponse = await util.checkUserId(event.userId);
    if (userIdCheckResponse.status !== 200) {
        return userIdCheckResponse;
    }

    const isIndividual = await util.isIndividual(event.userId);
    if (isIndividual) {
        const existingUserEvents = await eventRepository.findAllByUserIdLastMonth(event.userId);
        if (existingUserEvents.rows.length >= 3) {
            return {status: 400, message: "Event creation limit reached; user has already created 3 events this month."};
        }
    }

    if (!event.addressId) { // address doesn't exist in database yet
        const addressResult = await addressRepository.insert(event.address);
        event.addressId = addressResult.rows[0].id;
    }

    event.creationDate = new Date();
    const eventResult = await eventRepository.insert(event);
    return ({
        status: 200,
        message: "Event created successfully",
        data: {event: eventResult.rows[0]},
    });
};

/**
 * Updates an event that already exists in the database.
 * @param {object} event A valid event, an address object inside the event object.
 * Fails if database calls fail.
 */
const updateEvent = async (event) => {
    const address = event.address;
    event.addressId = address.id;
    await addressRepository.update(address);
    const updateEventResult = await eventRepository.update(event);
    return ({
        status: 200,
        message: "Event updated successfully",
        data: {event: updateEventResult.rows[0]},
    });
};

/**
 * Gets data about all events in the database.
 * @param {Array} filters filters to be applied to the events
 * @param {Number} userId id of the user
 * Fails if database calls fail.
 */
const getEvents = async (filters, userId) => {
    const userIdCheckResponse = await util.checkUserId(userId);
    if (userIdCheckResponse.status !== 200) userIdCheckResponse;

    const whereClause = filterer.getWhereClause(filters); // get corresponding where clause from the filters given
    const eventResult = await eventRepository.findAllWithAllData(whereClause);
    if (eventResult.rows.length === 0) return ({status: 404, message: "No events found"});

    // add going and spotsRemaining properties to all event objects
    let events = eventResult.rows.map(event => {
        return {...event, going: (event.volunteers).includes(userId), spotsRemaining: event.spotsAvailable - (event.volunteers).length};
    });

    const user = userIdCheckResponse.user;
    eventSorter.sortByTimeAndDistance(events, user);
    if (filters.maxDistance) events = events.filter(event => event.distance <= filters.maxDistance);
    return ({
        status: 200,
        message: "Events fetched successfully",
        data: {events: events},
    });
};

/**
 * Gets array of events grouped by causes selected by the user
 * @param {Array} filters filters to be applied to the events
 * @param {Number} userId id of the user
 * Fails if database calls fail.
 */
const getEventsBySelectedCauses = async (filters, userId) => {
    const userIdCheckResponse = await util.checkUserId(userId);
    if (userIdCheckResponse.status !== 200) userIdCheckResponse;

    const whereClause = filterer.getWhereClause(filters); // get corresponding where clause from the filters given
    const eventResult = await selectedCauseRepository.findEventsSelectedByUser(userId, whereClause);
    if (eventResult.rows.length === 0) return ({status: 404, message: "No events with causes selected by user and corresponding filters."});

    // add going and spotsRemaining properties to all event objects
    let events = eventResult.rows.map(event => {
        return {...event, going: (event.volunteers).includes(userId), spotsRemaining: event.spotsAvailable - (event.volunteers).length};
    });

    const user = userIdCheckResponse.user;
    eventSorter.sortByTimeAndDistance(events, user);

    if (filters.maxDistance) events = events.filter(event => event.distance <= filters.maxDistance);
    events = await eventSorter.groupByCause(events);

    return ({
        status: 200,
        message: "Events fetched successfully",
        data: events,
    });
};

/**
 * Gets data about an event that already exists in the database.
 * @param {Number} id Id of the event to be fetched.
 * Fails if database calls fail.
 */
const getEventData = async (id) => {
    const eventResult = await eventRepository.findById(id);
    const event = eventResult.rows[0];
    const eventSignUps = await signUpRepository.findAllByEventId(event.id);
    const spotsRemaining = event.spots - eventSignUps.rowCount;
    event.spotsRemaining = spotsRemaining;
    const addressResult = await addressRepository.findById(event.addressId);
    const address = addressResult.rows[0];
    return ({
        status: 200,
        message: "Event fetched successfully",
        data: {
            event: {
                ...event,
                address: address,
            },
        },
    });
};

module.exports = {
    createNewEvent,
    updateEvent,
    getEventData,
    getEvents,
    getEventsBySelectedCauses,
};
