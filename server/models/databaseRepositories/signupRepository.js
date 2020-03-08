const db = require("../../database/connection");

const insert = (signup) => {
    const query = "INSERT INTO sign_up VALUES ($1, $2, $3) " +
        "RETURNING *"; // returns inserted row
    const params = [signup.individualId, signup.eventId, signup.confirmed];
    return db.query(query, params);
};

const findAllByIndividualId = (individualId) => {
    const query = "SELECT * FROM sign_up WHERE individual_id=$1";
    return db.query(query, [individualId]);
};

const findAllByEventId = (eventId) => {
    const query = "SELECT * FROM sign_up WHERE event_id=$1";
    return db.query(query, [eventId]);
};

const find = (individualId, eventId) => {
    const query = "SELECT * FROM sign_up WHERE individual_id = $1 AND event_id=$2";
    const params = [individualId, eventId];
    return db.query(query, params);
};

const update = (signup) => {
    const query = "UPDATE sign_up SET confirmed = $1 WHERE individual_id = $2 AND event_id = $3 RETURNING *";
    const params = [signup.confirmed, signup.individualId, signup.eventId];
    return db.query(query, params);
};

const findUsersSignedUp = (eventId) => {
    const query = "SELECT event_id,individual_id,confirmed,firstname,lastname,user_id,email,username,date_registered " +
        "FROM sign_up LEFT JOIN individual ON individual_id = id(individual) RIGHT JOIN \"user\" ON user_id=id(\"user\")" +
        "WHERE event_id = $1";
    return db.query(query, [eventId]);
};

module.exports = {
    insert: insert,
    findAllByIndividualId: findAllByIndividualId,
    findAllByEventId: findAllByEventId,
    find: find,
    update: update,
    findUsersSignedUp: findUsersSignedUp,
};
