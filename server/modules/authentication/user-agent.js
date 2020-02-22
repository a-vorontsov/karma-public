const digest = require("./digest");

/**
 * Returns true if email exists in emails table
 * @param {string} email
 * @return {boolean} true if email exists in DB
 */
function emailExists(email) {
    return findByEmail(email) !== undefined;
}

/**
 * Returns true if email verified flag is true
 * @param {string} email
 * @return {boolean} true if email is verified
 */
function isEmailVerified(email) {
    return true;
}

/**
 * Returns true if user account associated to
 * given email address is partly registered.
 * Partial registration means an existing user
 * account without an individual / organisation
 * profile.
 * @param {string} email
 * @return {boolean} true if partly registered
 */
function isPartlyRegistered(email) {
    return false;
}

/**
 * Returns true if user account associated to
 * given email address is fully registered.
 * @param {string} email
 * @return {boolean} true if fully registered
 */
function isFullyRegistered(email) {
    return false;
}

/**
 * Register a new user with given email, username
 * and password.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 */
function registerUser(email, username, password) {
    const secureSalt = digest.getSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
        password,
        secureSalt,
    );
    pushNewUser(email, username, secureSalt, hashedPassword);
}

/**
 * Push a new user to the database.
 * This function should only be accessible from
 * withing this module.
 * @param {string} email
 * @param {string} username
 * @param {string} secureSalt 256-bit
 * @param {string} hashedPassword 256-bit
 */
function pushNewUser(email, username, secureSalt, hashedPassword) {
    users.push({
        id: nextId,
        email: email,
        username: username,
        salt: secureSalt,
        password: hashedPassword,
    });
    ++nextId;
    console.log(users);
}

/**
 * Register a new individual
 * @param {integer} id
 * @param {string} title //TODO: string?
 * @param {string} firstName
 * @param {string} middleNames
 * @param {string} surName
 * @param {Date} dateOfBirth
 * @param {string} gender //TODO: string?
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 */
function registerIndividual(id, title, firstName, middleNames, surName, dateOfBirth, gender, addressLine1, addressLine2, townCity, countryState, postCode, phoneNumber) {
    // TODO:
}

/**
 * Register a new organisation
 * @param {integer} id
 * @param {string} organisationNumber //TODO: string?
 * @param {string} name
 * @param {string} addressLine1
 * @param {string} addressLine2
 * @param {string} townCity
 * @param {string} countryState
 * @param {string} postCode
 * @param {string} phoneNumber
 */
function registerOrg(id, organisationNumber, name, addressLine1, addressLine2, townCity, countryState, postCode, phoneNumber) {
    // TODO:
}

/**
 * Change a user's password
 * @param {integer} id
 * @param {string} secureSalt 256-bit
 * @param {string} hashedPassword 256-bit
 */
function changePassword(id, secureSalt, hashedPassword) {
    const user = findById(id);
    user.salt = secureSalt;
    user.password = hashedPassword;
}

/**
 * Update password for an already existing, logged-in
 * user.
 * @param {HTTP} req
 */
function updatePassword(req) {
    // TODO: push
    console.log("update password called");
}

/**
 * Returns true if input password is correct for given user.
 * @param {Object} user
 * @param {string} password 256-bit
 * @return {boolean} true if password is correct
 */
function isCorrectPassword(user, password) {
    return user.password === digest.hashPassWithSaltInHex(password, user.salt);
}

/**
 * Return user with that email
 * @param email
 */
function findByEmail(email) {
    return users.find(user => user.email === email);
}

/**
 * Return user with that username
 * @param username
 */
function findByUsername(username) {
    return users.find(user => user.username === username);
}

/**
 * Return user with that id
 * @param id
 */
function findById(id) {
    return users.find(user => user.id === id);
}

/**
 * Return true if user with given ID exists.
 * @param {integer} id
 * @return {boolean} true if user exists
 */
function userExists(id) {
    return users.find(user => user.id === id) != undefined;
}

module.exports = {
    isFullyRegistered: isFullyRegistered,
    isPartlyRegistered: isPartlyRegistered,
    emailExists: emailExists,
    isEmailVerified: isEmailVerified,
    registerUser: registerUser,
    registerIndividual: registerIndividual,
    registerOrg: registerOrg,
    findByEmail: findByEmail,
    findByUsername: findByUsername,
    findById: findById,
    isCorrectPassword: isCorrectPassword,
    updatePassword: updatePassword,
    userExists: userExists,
};
