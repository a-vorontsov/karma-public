const db = require("../database/connection");

const insert = (userID, causeID) => {
    const query = "INSERT INTO selected_cause VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [userID, causeID];
    return db.query(query, params);
};

const insertMultiple = (userID, causes) => {
    const query = "INSERT INTO selected_cause SELECT $1 id, x FROM unnest($2::int[]) x "+
    "RETURNING *"; // returns inserted rows/selected causes
    const params = [userID, causes];
    return db.query(query, params);
};

const deleteUnselected = (userID, causes) =>{
    const query = "DELETE FROM selected_cause WHERE cause_id NOT IN (SELECT * FROM unnest($2::int[])) AND user_id = $1"+
    "RETURNING *"; // returns deleted selected causes
    const params = [userID, causes];
    return db.query(query, params);
};

const deleteMultiple = (userID, causes) =>{
    const query = "DELETE FROM selected_cause WHERE cause_id IN (SELECT * FROM unnest($2::int[])) AND user_id = $1"+
    "RETURNING *"; // returns deleted selected causes
    const params = [userID, causes];
    return db.query(query, params);
};

const findByUserId = (id) => {
    const query = "SELECT * FROM address WHERE user_id=$1";
    return db.query(query, [id]);
};
const findByCauseId = (id) => {
    const query = "SELECT * FROM address WHERE cause_id=$1";
    return db.query(query, [id]);
};
const find = (userID, causeID) => {
    const query = "SELECT * FROM address WHERE user_id = $1 AND cause_id=$2";
    const params = [userID, causes];
    return db.query(query, params);
};

module.exports = {
    insertSingle: insert,
    insertMultiple: insertMultiple,
    deleteUnselected: deleteUnselected,
    deleteMultiple: deleteMultiple,
    findByUserId: findByUserId,
    findByCauseId: findByCauseId,
    find: find,
};
