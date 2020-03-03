const db = require("../../database/connection");

const insert = (authentication) => {
    const query = "INSERT INTO authentication(token, expiry_date, creation_date, user_id) VALUES ($1, $2, $3, $4)" +
        "RETURNING *"; // returns passed authentication with it's id set to corresponding id in database
    const params = [authentication.token, authentication.expiry_date, authentication.creation_date, authentication.user_id];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM authentication WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM authentication";
    return db.query(query);
};

const findAllByUserID = (user_id) => {
    const query = "SELECT * FROM authentication WHERE user_id=$1";
    return db.query(query, [user_id]);
};

const findLatestByUserID = (user_id) => {
    const query = "SELECT * FROM authentication WHERE user_id=$1 ORDER BY creation_date DESC LIMIT 1";
    return db.query(query, [user_id]);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findAllByUserID: findAllByUserID,
    findLatestByUserID: findLatestByUserID,
};
