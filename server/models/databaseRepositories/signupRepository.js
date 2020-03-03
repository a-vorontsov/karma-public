const db = require("../../database/connection");

const insert = (signup) => {
    const query = "INSERT INTO sign_up VALUES ($1, $2, $3) " +
        "RETURNING *"; // returns inserted row
    const params = [signup.individual_id, signup.event_id, signup.confirmed];
    return db.query(query, params);
};

const findAllByIndividualId = async (individual_id) => {
    const query = "SELECT * FROM sign_up WHERE individual_id=$1";
    const queryResult = await db.query(query, [individual_id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No sign-ups found with individualID ${individual_id}`);
    }
    return queryResult;
};

const findAllByEventId = async (event_id) => {
    const query = "SELECT * FROM sign_up WHERE event_id=$1";
    const queryResult = db.query(query, [event_id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No sign-ups found with eventID ${event_id}`);
    }
    return queryResult;
};

const find = async (individual_id, event_id) => {
    const query = "SELECT * FROM sign_up WHERE individual_id = $1 AND event_id=$2";
    const params = [individual_id, event_id];
    const queryResult = await db.query(query, params);
    if(queryResult.rowCount === 0) {
        throw Error(`No sign-ups found with individualID ${individual_id} and eventID ${event_id}`);
    }
    return queryResult;
};

const update = async (signup) => {
    const query = "UPDATE sign_up SET confirmed = $1 WHERE individual_id = $2 AND event_id = $3 RETURNING *";
    const params = [signup.confirmed, signup.individual_id, signup.event_id];
    const queryResult = await db.query(query, params);
    if(queryResult.rowCount === 0) {
        throw Error(`No sign-up found with individualID ${signup.individual_id} and eventID ${signup.event_id}`);
    }
    return queryResult;
};

module.exports = {
    insert: insert,
    findAllByIndividualId: findAllByIndividualId,
    findAllByEventId: findAllByEventId,
    find: find,
    update: update,
};
