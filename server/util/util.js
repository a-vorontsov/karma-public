const userRepository = require("../models/databaseRepositories/userRepository");
const individualRepository = require("../models/databaseRepositories/individualRepository");
const organisationRepository = require("../models/databaseRepositories/organisationRepository");
const eventRepository = require("../models/databaseRepositories/eventRepository");

const isIndividual = async (userId) => {
    const userResult = await userRepository.findById(userId);
    if (userResult.rows.length === 0) {
        throw Error(`No user with id ${userId} exists`);
    }
    const individualResult = await individualRepository.findByUserID(userId);
    return individualResult.rows.length > 0; // found at least one individual with userId
};

const isOrganisation = async (userId) => {
    const userResult = await userRepository.findById(userId);
    if (userResult.rows.length === 0) {
        throw Error(`No user with id ${userId} exists`);
    }
    const organisationResult = await organisationRepository.findByUserID(userId);
    return organisationResult.rows.length > 0; // found at least one organisation with userId
};

const checkEmail = async (email) => {
    const result = {};
    if (!email) {
        result.status = 400;
        result.message = "No email was specified";
        return result;
    }
    const userResult = await userRepository.findByEmail(email);
    const user = userResult.rows[0];
    if (!user) {
        result.status = 404;
        result.message = "No user with specified email";
        return result;
    }
    result.status = 200;
    result.user = user;
    return result;
};

const checkUserId = async (userId) => {
    const result = {};
    if (!userId) {
        result.status = 400;
        result.message = "No user id was specified in the query";
        return result;
    }
    if (isNaN(userId)) {
        result.status = 400;
        result.message = "ID specified is in wrong format";
        return result;
    }
    const userResult = await userRepository.getUserLocation(userId);
    const user = userResult.rows[0];
    if (!user) {
        result.status = 404;
        result.message = "No user with specified id";
        return result;
    }
    result.status = 200;
    result.user = user;
    return result;
};

const checkEventId = async (eventId) => {
    const result = {};
    if (!eventId) {
        result.status = 400;
        result.message = "Event ID not defined";
        return result;
    }
    if (isNaN(eventId)) {
        result.status = 400;
        result.message = "ID specified is in wrong format";
        return result;
    }
    const eventResult = await eventRepository.findById(eventId);
    const event = eventResult.rows[0];
    if (!event) {
        result.status = 404;
        result.message = "No event with specified id";
        return result;
    }
    result.status = 200;
    result.event = event;
    return result;
};


module.exports = {
    isIndividual: isIndividual,
    isOrganisation: isOrganisation,
    checkUserId: checkUserId,
    checkEventId: checkEventId,
    checkEmail: checkEmail,
};
