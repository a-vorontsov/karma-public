const db = require("../../database/connection");

const insert = (authentication) => {
    const query = "INSERT INTO authentication(token, expiry_date, creation_date, user_id) VALUES ($1, $2, $3, $4)" +
        "RETURNING *"; // returns passed authentication with it's id set to corresponding id in database
    const params = [authentication.token, authentication.expiry_date, authentication.creation_date, authentication.user_id];
    return db.query(query, params);
};

const findById = async (id) => {
    const query = "SELECT * FROM authentication WHERE id=$1";
    const queryResult = await db.query(query, [id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No authentication with id ${id} exists`);
    }
    return queryResult;
};

const findAll = async () => {
    const query = "SELECT * FROM authentication";
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No authentication exists`);
    }
    return queryResult;
};

const findAllByUserID = async (user_id) => {
    const query = "SELECT * FROM authentication WHERE user_id=$1";
    const queryResult = await db.query(query, [user_id]);

    if(queryResult.rowCount === 0) {
        throw Error(`No authentication with user_id ${user_id} exists`);
    }
    return queryResult;

};

const findLatestByUserID = async (user_id) => {
    const query = "SELECT * FROM authentication WHERE user_id=$1 ORDER BY creation_date DESC LIMIT 1";
    const queryResult = await db.query(query, [user_id]);

    if(queryResult.rowCount === 0) {
        throw Error(`No authentication with user_id ${user_id} exists`);
    }
    return queryResult;

};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findAllByUserID: findAllByUserID,
    findLatestByUserID: findLatestByUserID,
};
