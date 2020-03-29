const eventRepository = require("../../../repositories/event");
const signupRepository = require("../../../repositories/event/signup");
const individualRepository = require("../../../repositories/individual");
const profileRepository = require("../../../repositories/profile");
const util = require("../../../util");
const eventSorter = require("../../sorting");

/**
 * Creates a new event signup to be added to the database.
 * @param {object} signup An object containing a valid individualId and a boolean named "confirmed" that represents
 * whether the individual is going to the event or not.
 * Fails if individualId is invalid, or database call fails.
 */
const createSignup = async (signup) => {
    const eventIdCheckResponse = await util.checkEventId(signup.eventId);
    if (eventIdCheckResponse.status !== 200) {
        throw new Error(eventIdCheckResponse.message);
    }
    const userIdCheckResponse = await util.checkUserId(signup.userId);
    if (userIdCheckResponse.status !== 200) {
        throw new Error(userIdCheckResponse.message);
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
        throw new Error(eventIdCheckResponse.message);
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
 * Get the sign-up status from the database for a specific individual,
 * regarding a specific event.
 * @param {object} signup An object containing a valid individualId and a valid eventId
 * Fails if individualId or eventId is invalid, or database call fails.
 */
const getSignupStatus = async (signup) => {
    signup.individualId = await util.getIndividualIdFromUserId(signup.userId);
    const signupResult = await signupRepository.find(signup.individualId, signup.eventId);

    if (signupResult.rows.length < 1) {
        return ({
            status: 404,
            message: "You have not signed up for this event",
        });
    } else {
        return ({
            status: 200,
            message: "Signup status fetched successfully",
            data: {signup: signupResult.rows[0]},
        });
    }
};

/**
 * Get all future signups from the database for a specific user.
 * @param {object} userId A valid userId.
 * @return {object} result in httpUtil's sendResult format
 * Fails if userId is invalid, or database call fails.
 */
const getGoingEvents = async (userId) => {
    const userIdCheckResponse = await util.checkUser(userId);
    if (userIdCheckResponse.status !== 200) {
        throw new Error(userIdCheckResponse.message);
    }
    const findResult = await individualRepository.findGoingEvents(userId);
    let events = findResult.rows;
    const user = userIdCheckResponse.user;
    // add spotsRemaining property to all event objects
    events = events.map(event => {
        return {...event,
            spotsRemaining: event.spots - (event.volunteers).length,
            favourited: (event.favourited).includes(Number.parseInt(userId)),
            going: true,
        };
    });
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
    const oldSignup = await signupRepository.find(signup.individualId, signup.eventId);
    if (oldSignup.rows[0].attended === false && signup.attended === true) {
        await profileRepository.updateKarmaPoints(signup.individualId);
    };
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
    getSignupStatus,
    updateSignUp,
    getGoingEvents,
};
