const digest = require("./digest");

// @temporary Since we don't yet have a DB connection
const users = [];
var nextId = users.length;

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
function updatePassword(user, secureSalt, hashedPassword) {
  user.salt = secureSalt;
  user.password = hashedPassword;
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
  findById: findById
};
