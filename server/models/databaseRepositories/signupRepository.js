const db = require("../../database/connection");

const insert = (signup) => {
    const query = "INSERT INTO sign_up VALUES ($1, $2, $3) " +
        "RETURNING *"; // returns inserted row
    const params = [signup.individual_id, signup.event_id, signup.confirmed];
    return db.query(query, params);
};

const findAllByIndividualId = (individual_id) => {
    const query = "SELECT * FROM sign_up WHERE individual_id=$1";
    return db.query(query, [individual_id]);
};

const findAllByEventId = (event_id) => {
    const query = "SELECT * FROM sign_up WHERE event_id=$1";
    return db.query(query, [event_id]);
};

const find = (individual_id, event_id) => {
    const query = "SELECT * FROM sign_up WHERE individual_id = $1 AND event_id=$2";
    const params = [individual_id, event_id];
    return db.query(query, params);
};

const update = (signup) => {
    const query = "UPDATE sign_up SET confirmed = $1 WHERE individual_id = $2 AND event_id = $3 RETURNING *";
    const params = [signup.confirmed, signup.individual_id, signup.event_id];
    return db.query(query, params);
};

const findUsersSignedUp = (event_id) => {
    const query = "SELECT event_id,individual_id,confirmed,firstname,lastname,user_id,email,username,date_registered " +
        "FROM sign_up LEFT JOIN individual ON individual_id = id(individual) RIGHT JOIN \"user\" ON user_id=id(\"user\")" +
        "WHERE event_id = $1";
    return db.query(query, [event_id]);
};

module.exports = {
    insert: insert,
    findAllByIndividualId: findAllByIndividualId,
    findAllByEventId: findAllByEventId,
    find: find,
    update: update,
    findUsersSignedUp: findUsersSignedUp,
};
