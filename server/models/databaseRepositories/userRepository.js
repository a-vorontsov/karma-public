const db = require("../../database/connection");

const insert = (user) => {
    const query = "INSERT INTO \"user\"(email, username, password_hash, verified, salt, date_registered) VALUES ($1, $2, $3, $4, $5, $6)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [user.email, user.username, user.password_hash, user.verified, user.salt, user.date_registered];
    return db.query(query, params);
};

const findById = async (id) => {
    const query = "SELECT * FROM \"user\" WHERE id=$1";
    const queryResult = await db.query(query, [id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No user found with id ${id}`);
    }
    return queryResult;
};

const findAll = async () => {
    const query = "SELECT * FROM \"user\"";
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No users found`);
    }
    return queryResult;
};
const getUsersLocations = async () => {
    const query = "select user_id,lat,long from profile natural join individual " +
        "natural join \"user\" left join address on address_id = id(address)";
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No users found`);
    }
    return queryResult;
};
const getUserLocation = async (userId) => {
    const query = "select user_id, lat,long from individual left join address on address_id = id(address) where user_id = $1";
    const queryResult = await db.query(query, [userId]);
    if(queryResult.rowCount === 0) {
        throw Error(`No user found with UserID ${userId}`);
    }
    return queryResult;
};

const findByEmail = async (email) => {
    const query = "SELECT * FROM \"user\" WHERE email=$1";
    const queryResult = await db.query(query, [email]);
    if(queryResult.rowCount === 0) {
        throw Error(`No user found with email ${email}`);
    }
    return queryResult;
};

const findByUsername = async (username) => {
    const query = "SELECT * FROM \"user\" WHERE username=$1";
    const queryResult = await db.query(query, [username]);
    if(queryResult.rowCount === 0) {
        throw Error(`No user found with username ${username}`);
    }
    return queryResult;
};

const updatePassword = async (userId, hashedPassword) => {
    const query = "UPDATE \"user\" SET password_hash = $2 WHERE id = $1 RETURNING *";
    const params = [userId, hashedPassword];
    const queryResult = await db.query(query, params);
    if(queryResult.rowCount === 0) {
        throw Error(`No user found with UserID ${userId}`);
    }
    return queryResult;
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
