const digest = require("./digest");

// @temporary Since we don't yet have a DB connection
const users = [];
var nextId = users.length;

users.push({
  id: "admin0",
  username: "admin",
  name: "admin",
  email: "dan@dan.com",
  salt: "d7895ef4ceb93b9808818dd1246026cef2a50a2351b447b29e08319d41b86713",
  password: "bf6d74ab2d96afe33cd66ad1e9dc8eeb2c5e4a1d9d8001a2cb501708a02f1dc4"
});

/**
 * Register a new user based on the HTTP request.
 * @param req
 */
function register(req) {
  const secureSalt = digest.getSecureSaltInHex();
  const hashedPassword = digest.hashPassWithSaltInHex(
    req.body.password,
    secureSalt
  );
  pushNewUser(req, secureSalt, hashedPassword);
}

/**
 * Push a new user to the database.
 * This function should only be accessible from
 * withing this module.
 * @param req
 * @param secureSalt
 * @param hashedPassword
 */
function pushNewUser(req, secureSalt, hashedPassword) {
  users.push({
    id: nextId,
    username: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    salt: secureSalt,
    password: hashedPassword
  });
  ++nextId;
  console.log(users);
}

/**
 *
 * @param {Object} user
 * @param secureSalt
 * @param hashedPassword
 */
function resetPassword(user, secureSalt, hashedPassword) {
  user.salt = secureSalt;
  user.password = hashedPassword;
}

/**
 * Update password for an already existing, logged-in
 * user.
 * @param req
 */
function updatePassword(req) {
  console.log("update password called");
}

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
  updatePassword: updatePassword
};
