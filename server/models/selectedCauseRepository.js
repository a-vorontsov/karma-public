const db = require("../database/connection");
const filterer = require("../modules/filtering");

const insert = (userID, causeID) => {
    const query = "INSERT INTO selected_cause VALUES ($1, $2) " +
        "RETURNING *"; // returns inserted row
    const params = [userID, causeID];
    return db.query(query, params);
};

const insertMultiple = (userID, causes) => {
    const query = "INSERT INTO selected_cause SELECT $1 id, x FROM unnest($2::int[]) x " +
        "RETURNING *"; // returns inserted rows/selected causes
    const params = [userID, causes];
    return db.query(query, params);
};

const deleteUnselected = (userID, causes) => {
    const query = "DELETE FROM selected_cause WHERE cause_id NOT IN (SELECT * FROM unnest($2::int[])) AND user_id = $1" +
        "RETURNING *"; // returns deleted selected causes
    const params = [userID, causes];
    return db.query(query, params);
};

const deleteMultiple = (userID, causes) => {
    const query = "DELETE FROM selected_cause WHERE cause_id IN (SELECT * FROM unnest($2::int[])) AND user_id = $1" +
        "RETURNING *"; // returns deleted selected causes
    const params = [userID, causes];
    return db.query(query, params);
};

const findByUserId = (id) => {
    const query = "SELECT * FROM selected_cause WHERE user_id=$1";
    return db.query(query, [id]);
};
const findByCauseId = (id) => {
    const query = "SELECT * FROM selected_cause WHERE cause_id=$1";
    return db.query(query, [id]);
};
const find = (userID, causeID) => {
    const query = "SELECT * FROM selected_cause WHERE user_id = $1 AND cause_id=$2";
    const params = [userID, causeID];
    return db.query(query, params);
};

const findEventsSelectedByUser = (userID, filters) => {
    let whereClause = filterer.getWhereClause(filters);
    if (whereClause === "") whereClause = "where ";
    else whereClause += " and ";
    const query = "select id(event),name(event),address_id,women_only,spots,address_visible,minimum_age,photo_id," +
        "physical, add_info,content,date,cause_id(event_cause),name(cause) as cause_name,description as cause_description," +
        "user_id(event) as event_creator_id,address_1,address_2,postcode,city,region,lat,long from event " +
        "left join event_cause on id(event) = event_id " +
        "right join selected_cause on cause_id(event_cause)=cause_id(selected_cause) " +
        "left join cause on cause_id(event_cause) = id(cause) " +
        "left join address on id(address) = address_id " +
        whereClause + "user_id(selected_cause) = $1";
    return db.query(query, [userID]);
};

module.exports = {
    insert: insert,
    insertMultiple: insertMultiple,
    deleteUnselected: deleteUnselected,
    deleteMultiple: deleteMultiple,
    findByUserId: findByUserId,
    findByCauseId: findByCauseId,
    findEventsSelectedByUser: findEventsSelectedByUser,
    find: find,
};
