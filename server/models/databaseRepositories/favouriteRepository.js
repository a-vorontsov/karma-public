const db = require("../../database/connection");

const insert = (favourite) => {
    const query = "INSERT INTO favourite VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [favourite.individual_id, favourite.event_id];
    return db.query(query, params);
};

const findAllByIndividualId = (individual_id) => {
    const query = "SELECT * FROM favourite WHERE individual_id=$1";
    return db.query(query, [individual_id]);
};

const findAllByEventId = (event_id) => {
    const query = "SELECT * FROM favourite WHERE event_id=$1";
    return db.query(query, [event_id]);
};

const find = (individual_id, event_id) => {
    const query = "SELECT * FROM favourite WHERE individual_id = $1 AND event_id=$2";
    const params = [individual_id, event_id];
    return db.query(query, params);
};

const remove = (favourite) => {
    const query = "DELETE FROM favourite WHERE individual_id=$1 AND event_id=$2 RETURNING *";
    const params = [favourite.individual_id, favourite.event_id];
    return db.query(query, params);
};

module.exports = {
    insert: insert,
    findAllByIndividualId: findAllByIndividualId,
    findAllByEventId: findAllByEventId,
    find: find,
    remove: remove,
};
