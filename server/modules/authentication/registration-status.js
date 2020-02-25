const regRepo = require("../../models/registrationRepository");
const userRepo = require("../../models/userRepository");

/**
 * Returns true if email exists in registration table
 * @param {string} email
 * @return {boolean} true if email exists in DB
 */
function emailExists(email) {
    try {
        // regRepo throws an error if query returns undefined
        regRepo.findByEmail(email);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Returns true if email verified flag is true
 * in the registration table.
 * This throws an error if the provided email
 * is not found, therefore this should only be
 * called after emailExists has been checked.
 * @param {string} email
 * @return {boolean} true if email is verified
 * @throws {error} if email is not found
 */
function isEmailVerified(email) {
    const regRecord = regRepo.findByEmail(email);
    return regRecord.email_flag;
}

/**
 * Returns true if user account associated to
 * given email address is partly registered.
 * Partial registration means having an existing user
 * account without an individual / organisation
 * profile.
 * This throws an error if the provided email
 * is not found, therefore this should only be
 * called after emailExists has been checked.
 * @param {string} email
 * @return {boolean} true if partly registered
 * @throws {error} if email is not found
 */
function isPartlyRegistered(email) {
    return !isFullyRegisteredByEmail(email) && userRepo.findByEmail(email);
}

/**
 * Returns true if user account associated to
 * given email address is fully registered.
 * A full registration means having an associated
 * user and either an individual or an org record.
 * This throws an error if the provided email
 * is not found, therefore this should only be
 * called after emailExists has been checked.
 * @param {string} email
 * @return {boolean} true if fully registered
 * @throws {error} if email is not found
 */
function isFullyRegisteredByEmail(email) {
    const regRecord = regRepo.findByEmail(email);
    return regRecord.sign_up_flag;
}

/**
 * Returns true if user account associated to
 * given user id is fully registered.
 * A full registration means having an associated
 * user and either an individual or an org record.
 * This throws an error if the provided userId
 * is not found, therefore this should only be
 * called after emailExists has been checked.
 * @param {integer} userId
 * @return {boolean} true if fully registered
 * @throws {error} if useId is not found
 */
function isFullyRegisteredById(userId) {
    const userRecord = userRepo.findById(userId);
    return isFullyRegisteredByEmail(userRecord.email);
}

module.exports = {
    emailExists: emailExists,
    isEmailVerified: isEmailVerified,
    isPartlyRegistered: isPartlyRegistered,
    isFullyRegisteredByEmail: isFullyRegisteredByEmail,
    isFullyRegisteredById: isFullyRegisteredById,
};
