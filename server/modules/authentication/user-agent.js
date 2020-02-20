const digest = require("./digest");

// @temporary Since we don't yet have a DB connection
const users = [];
let nextId = users.length;

users.push({
    id: "admin0",
    username: "admin",
    email: "dan@dan.com",
    salt: "d7895ef4ceb93b9808818dd1246026cef2a50a2351b447b29e08319d41b86713",
    password: "bf6d74ab2d96afe33cd66ad1e9dc8eeb2c5e4a1d9d8001a2cb501708a02f1dc4",
});

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
 * @param {string} foreName
 * @param {string} surName
 * @param {date} birthDate
 */
function registerIndividual(id, foreName, surName, birthDate) {
    // TODO:
}

/**
 * Register a new organisation
 * @param {integer} id
 * @param {string} name
 * @param {string} orgNumber
 */
function registerOrg(id, name, orgNumber) {
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
    findByEmail: findByEmail,
    findByUsername: findByUsername,
    findById: findById,
    isCorrectPassword: isCorrectPassword,
    updatePassword: updatePassword,
    userExists: userExists,
};
