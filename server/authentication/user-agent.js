const digest = require("./digest");

// @temporary Since we don't yet have a DB connection
const users = [];
let nextId = users.length;

users.push({
    id: "admin0",
    username: "admin",
    name: "admin",
    email: "dan@dan.com",
    salt: "d7895ef4ceb93b9808818dd1246026cef2a50a2351b447b29e08319d41b86713",
    password: "bf6d74ab2d96afe33cd66ad1e9dc8eeb2c5e4a1d9d8001a2cb501708a02f1dc4",
});

/**
 * Register a new user based on the HTTP request.
 * @param {HTTP} req
 */
function register(req) {
    const secureSalt = digest.getSecureSaltInHex();
    const hashedPassword = digest.hashPassWithSaltInHex(
        req.body.password,
        secureSalt,
    );
    pushNewUser(req, secureSalt, hashedPassword);
}

/**
 * Push a new user to the database.
 * This function should only be accessible from
 * withing this module.
 * @param {HTTP} req
 * @param {string} secureSalt 256-bit
 * @param {string} hashedPassword 256-bit
 */
function pushNewUser(req, secureSalt, hashedPassword) {
    users.push({
        id: nextId,
        username: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        salt: secureSalt,
        password: hashedPassword,
    });
    ++nextId;
    console.log(users);
}

/**
 * Change a user's password
 * @param {Object} user
 * @param {string} secureSalt 256-bit
 * @param {string} hashedPassword 256-bit
 */
function changePassword(user, secureSalt, hashedPassword) {
    //TODO: push
    user.salt = secureSalt;
    user.password = hashedPassword;
}

/**
 * Update password for an already existing, logged-in
 * user.
 * @param {HTTP} req
 */
function updatePassword(req) {
    //TODO: push
    console.log("update password called");
}

/**
 * Returns true if input password is correct for given user.
 * @param {Object} user 
 * @param {string} password 256-bit
 * @returns {boolean} true if password is correct
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

module.exports = {
    register: register,
    findByEmail: findByEmail,
    findByUsername: findByUsername,
    findById: findById,
    isCorrectPassword: isCorrectPassword,
    updatePassword: updatePassword,
};
