const digest = require("./digest");
const regRepo = require("../../models/registrationRepository");
const userRepo = require("../../models/userRepository");
const regStatus = require("./registration-status");

/**
 * Register a new record in the registration table.
 * @param {string} email
 * @throws {error} if email already stored
 * @throws {error} if invalid query
 */
function registerEmail(email) {
    if (regStatus.emailExists(email)) {
        throw new Error("Invalid operation: email already exists.");
    }
    regRepo.insert({
        email: email,
        email_flag: false,
        id_flag: false,
        phone_flag: false,
        sign_up_flag: false,
    });
}

/**
 * Register a new user with given email, username
 * and password.
 * @param {string} email
 * @param {string} username
 * @param {string} password
 * @throws {error} if registration record not found
 * @throws {error} if already registered
 * @throws {error} if invalid query
 */
function registerUser(email, username, password) {
    if (regStatus.emailExists(email)) {
        throw new Error("Invalid operation: registration record not found.");
    }
    if (regStatus.isPartlyRegistered(email) || regStatus.isFullyRegistered(email)) {
        throw new Error("Invalid operation: user record already exists.");
    }
    const secureSalt = digest.getSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
        password,
        secureSalt,
    );
    userRepo.insert({
        email: email,
        username: username,
        password_hash: hashedPassword,
        verified: false,
        salt: secureSalt,
        date_registered: Date.now(),
    });
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
    registerEmail: registerEmail,
    registerUser: registerUser,
};
