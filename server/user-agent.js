const digest = require("./digest");

// @temporary Since we don't yet have a DB connection
const users = [];
var nextId = users.length;

function register(req) {
  const secureSalt = digest.getSecureSaltInHex();
  const hashedPassword = digest.hashPassWithSaltInHex(
    req.body.password,
    secureSalt
  );
  pushNewUser(req, secureSalt, hashedPassword);
}


function pushNewUser(req, secureSalt, hashedPassword) {
  users.push({
    id: nextId,
    username: Date.now.toString,
    name: req.body.name,
    email: req.body.email,
    salt: secureSalt,
    password: hashedPassword
  });
  ++nextId;
  console.log(users);
}

function updatePassword(user, secureSalt, hashedPassword) {
  user.salt = secureSalt;
  user.password = hashedPassword;
}

function findByEmail(email) {
  return users.find(user => user.email === email);
}

function findByUsername(username) {
  return users.find(user => user.username === username);
}

function findById(id) {
  return users.find(user => user.id === id);
}

module.exports = {
  pushNewUser: pushNewUser,
  findByEmail: findByEmail,
  findById: findById
};
