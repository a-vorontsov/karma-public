const eventRepository = require("../../../models/databaseRepositories/eventRepository");
const signupRepository = require("../../../models/databaseRepositories/signupRepository");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");
const util = require("../../../util/util");
const eventSorter = require("../../sorting/event");

/**
 * Creates a new event signup to be added to the database.
 * @param {object} signup An object containing a valid individualId and a boolean named "confirmed" that represents
 * whether the individual is going to the event or not.
 * Fails if individualId is invalid, or database call fails.
 */
const createSignup = async (signup) => {
    const eventIdCheckResponse = await util.checkEventId(signup.eventId);
    if (eventIdCheckResponse.status !== 200) {
        return eventIdCheckResponse;
    }

    const signupResult = await signupRepository.insert(signup);
    return ({
        status: 200,
        message: "Signup created successfully",
        data: {signup: signupResult.rows[0]},
    });
};

/**
 * Get all signups from the database for a specific event.
 * @param {object} eventId A valid eventId.
 * Fails if eventId is invalid, or database call fails.
 */
const getAllSignupsForEvent = async (eventId) => {
    const eventIdCheckResponse = await util.checkEventId(eventId);
    if (eventIdCheckResponse.status !== 200) {
        return eventIdCheckResponse;
    }

    const signedUpUsersResult = await signupRepository.findUsersSignedUp(eventId);
    return ({
        status: 200,
        message: "Signups fetched successfully",
        data: {users: signedUpUsersResult.rows},
    });
};

/**
 * Get all past signups from the database for a specific individual.
 * @param {object} individualId A valid individualId.
 * Fails if individualId is invalid, or database call fails.
 */
const getSignupHistory = async (individualId) => {
    const signups = await signupRepository.findAllByIndividualId(individualId);
    const now = new Date();
    const signedUpEvents = (await Promise.all(signups.rows.map(signup => signup.eventId)
        .map(eventId => eventRepository.findById(eventId))))
        .map(eventResult => eventResult.rows[0])
        .filter(event => event.date < now);
    return ({
        status: 200,
        message: "History fetched successfully",
        data: {events: signedUpEvents},
    });
};
/**
 * Get all future signups from the database for a specific user.
 * @param {object} userId A valid userId.
 * Fails if userId is invalid, or database call fails.
 */
const getGoingEvents = async (userId) => {
    const userIdCheckResponse = await util.checkUserId(userId);
    if (userIdCheckResponse.status !== 200) userIdCheckResponse;
    const findResult = await individualRepository.findGoingEvents(userId);
    const events = findResult.rows;
    if (events.length === 0) return ({status: 404, message: "No favourite events found"});
    const user = userIdCheckResponse.user;
    eventSorter.sortByTimeAndDistance(events, user);
    return ({
        status: 200,
        message: "Future going events fetched successfully",
        data: {events: events},
    });
};

/**
 * Updates a signup already in the database.
 * @param {object} signup A signup object with the required columns from the database.
 * Fails if database call fails.
 */
const updateSignUp = async (signup) => {
    const signupResult = await signupRepository.update(signup);
    return ({
        status: 200,
        message: "Signup updated successfully",
        data: {signup: signupResult.rows[0]},
    });
};

module.exports = {
    createSignup,
    getAllSignupsForEvent,
    getSignupHistory,
    updateSignUp,
    getGoingEvents,
};
