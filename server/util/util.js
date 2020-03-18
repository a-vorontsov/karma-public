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
    const userResult = await userRepository.findById(userId);
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

const checkUser = async (userId) => {
    const result = {};
    const checkUserIdResult = await checkUserId(userId);
    const user = checkUserIdResult.user;
    if (user) {
        const userIdResult = await userRepository.getUserLocation(userId);
        if (userIdResult.rows.length >0) {
            const individualResult = await individualRepository.findByUserID(userId);
            const orgResult = await organisationRepository.findByUserID(userId);
            if (individualResult.rows.length>0 || orgResult.rows.length>0) {
                result.status = 400;
                result.message = "No address associated with specified user id";
                return result;
            } else {
                result.status = 400;
                result.message = "No individual nor organisation is associated with specified user id";
                return result;
            }
        } else {
            result.status = 200;
            result.user = user;
            return result;
        }
    } else {
        return checkUserIdResult;
    }
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

/**
 * Check if input token is valid compared to
 * tokenResult - result of db query.
 * This requires the token to be of valid format,
 * matching the user specified by the userId in
 * the database and to be not expired.
 * If no token is found for specified user or
 * user is not found, a custom error is returned.
 * @param {object} tokenResult
 * @param {any} inputToken
 * @param {string} tokenVarName variable name of token
 * @return {object} isValidToken, error
 */
const isValidToken = async (tokenResult, inputToken, tokenVarName) => {
    if (tokenResult.rows.length === 0) {
        return ({
            isValidToken: false,
            error: "No token found, or user/email does not exist.",
        });
    }
    const tokenRecord = tokenResult.rows[0];
    if (tokenRecord[tokenVarName] !== inputToken) {
        return ({
            isValidToken: false,
            error: "Invalid token",
        });
    } else if (tokenRecord.expiryDate <= Date.now()) {
        return ({
            isValidToken: false,
            error: "Expired token",
        });
    } else {
        return ({
            isValidToken: true,
            error: null,
        });
    }
};

/**
 * Sleep n milliseconds.
 * @param {number} ms
 * @return {Promise}
 */
const sleep = async (ms) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
};

module.exports = {
    isIndividual,
    isOrganisation,
    checkUserId,
    checkUser,
    checkEventId,
    checkEmail,
    isValidToken,
    sleep,
};
