const regRepo = require("../../models/registrationRepository");
const userRepo = require("../../models/userRepository");

/**
 * Returns true if email exists in registration table
 * @param {string} email
 * @return {boolean} true if email exists in DB
 * @throws {error} if failed query
 */
async function emailExists(email) {
    // regRepo might throw an error if query returns undefined
    const regResult = await regRepo.findByEmail(email);
    const regRecord = regResult.rows[0];
    return regRecord !== undefined;
}

/**
 * Returns true if email verified flag is true
 * in the registration table.
 * This throws an error if the provided email
 * is not found, therefore this should only be
 * called after emailExists has been checked.
 * @param {string} email
 * @return {boolean} true if email is verified
 * @throws {error} if failed query
 */
async function isEmailVerified(email) {
    const regResult = await regRepo.findByEmail(email);
    const regRecord = regResult.rows[0];
    if (regRecord === undefined) {
        throw new Error("Registration record with given email does not exist");
    }
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
 * @throws {error} if failed query
 */
async function isPartlyRegistered(email) {
    const userResult = await userRepo.findByEmail(email);
    const userRecord = userResult.rows[0];
    return !(await isFullyRegisteredByEmail(email)) && (userRecord !== undefined);
}

/**
 * Returns true if user account associated to
 * given email address exists.
 * @param {string} email
 * @return {boolean} true if user account exists
 * @throws {error} if failed query
 */
async function userAccountExists(email) {
    const userResult = await userRepo.findByEmail(email);
    const userRecord = userResult.rows[0];
    return userRecord !== undefined;
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
 * @throws {error} if failed query
 */
async function isFullyRegisteredByEmail(email) {
    const regResult = await regRepo.findByEmail(email);
    const regRecord = regResult.rows[0];
    if (regRecord === undefined) {
        throw new Error("Registration record with given email does not exist");
    }
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
 * @throws {error} if failed query
 */
async function isFullyRegisteredById(userId) {
    const userResult = await userRepo.findById(userId);
    const userRecord = userResult.rows[0];
    if (userRecord === undefined) {
        throw new Error("User with given ID does not exist");
    }
    return await isFullyRegisteredByEmail(userRecord.email);
}

module.exports = {
    emailExists: emailExists,
    isEmailVerified: isEmailVerified,
    isPartlyRegistered: isPartlyRegistered,
    isFullyRegisteredByEmail: isFullyRegisteredByEmail,
    isFullyRegisteredById: isFullyRegisteredById,
    userAccountExists: userAccountExists,
};
