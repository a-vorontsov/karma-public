const db = require("../../database/connection");

const insert = (user) => {
    const query = "INSERT INTO \"user\"(email, username, password_hash, verified, salt, date_registered) VALUES ($1, $2, $3, $4, $5, $6)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [user.email, user.username, user.password_hash, user.verified, user.salt, user.date_registered];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM \"user\" WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM \"user\"";
    return db.query(query);
};
const getUsersLocations = () => {
    const query = "select user_id,lat,long from profile natural join individual " +
        "natural join \"user\" left join address on address_id = id(address)";
    return db.query(query);
};
const getUserLocation = (userId) => {
    const query = "select user_id, lat,long from individual left join address on address_id = id(address) where user_id = $1";
    return db.query(query, [userId]);
};

const findByEmail = (email) => {
    const query = "SELECT * FROM \"user\" WHERE email=$1";
    return db.query(query, [email]);
};

const findByUsername = (username) => {
    const query = "SELECT * FROM \"user\" WHERE username=$1";
    return db.query(query, [username]);
};

const updatePassword = (userId, hashedPassword) => {
    const query = "UPDATE \"user\" SET password_hash = $2 WHERE id = $1 RETURNING *";
    const params = [userId, hashedPassword];
    return db.query(query, params);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    getUsersLocations: getUsersLocations,
    getUserLocation: getUserLocation,
    findByEmail: findByEmail,
    findByUsername: findByUsername,
    updatePassword: updatePassword,
};
