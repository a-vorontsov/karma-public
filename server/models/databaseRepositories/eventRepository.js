const db = require("../../database/connection");
const filterer = require("../../modules/filtering");

const insert = (event) => {
    const query = "INSERT INTO event(name, address_id, women_only, spots, address_visible, minimum_age, " +
        "photo_id, physical, add_info, content, date, user_id, creation_date) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) " +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.address_id, event.women_only, event.spots, event.address_visible,
        event.minimum_age, event.photo_id, event.physical, event.add_info, event.content, event.date, event.user_id,
        event.creation_date,
    ];
    return db.query(query, params);
};

const findById = async (id) => {
    const query = "SELECT * FROM event WHERE id=$1";
    const queryResult = await db.query(query, [id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No event with id ${id} exists`);
    }
    return queryResult;
};

const findAll = async () => {
    const query = "SELECT * FROM event";
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No event exists`);
    }
    return queryResult;
};

const findAllByUserId = async (userId) => {
    const query = "SELECT * FROM event WHERE user_id=$1";
    const queryResult = await db.query(query, [userId]);
    if(queryResult.rowCount === 0) {
        throw Error(`No cause with user_id ${userId} exists`);
    }
    return queryResult;
};

const findAllByUserIdLastMonth = async (userId) => {
    const currentDateTime = new Date();
    currentDateTime.setDate(currentDateTime.getDate() - 30);
    const query = "SELECT * FROM event WHERE user_id=$1 AND creation_date>$2";
    const queryResult = await db.query(query, [userId, currentDateTime]);
    if(queryResult.rowCount === 0) {
        throw Error(`No event with user_id ${userId} in the last month exists`);
    }
    return queryResult;
};

const update = async (event) => {
    const query = "UPDATE event SET name = $1, address_id = $2, women_only = $3, spots = $4, address_visible = $5, " +
        "minimum_age = $6, photo_id = $7, physical = $8, add_info = $9, content = $10, " +
        "date = $11, user_id = $12, creation_date = $13 WHERE id = $14" +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.address_id, event.women_only, event.spots, event.address_visible,
        event.minimum_age, event.photo_id, event.physical, event.add_info, event.content, event.date, event.user_id,
        event.creation_date, event.id,
    ];
    const queryResult = await db.query(query, params);
    if(queryResult.rowCount === 0) {
        throw Error(`No event with id ${event.id} exists`);
    }
    return queryResult;
};

const getEventsWithLocation = async (filters) => {
    const whereClause = filterer.getWhereClause(filters);
    const query = "select id(event) as event_id,name,women_only,spots,address_visible,minimum_age,photo_id," +
        "physical,add_info,content,date,user_id as event_creator_id,address_1,address_2,postcode,city,region,lat,long " +
        "from address right join event on id(address) = address_id" + whereClause;
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No event with these filters exists`);
    }
    return queryResult;

};
module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    update: update,
    getEventsWithLocation: getEventsWithLocation,
    findAllByUserId: findAllByUserId,
    findAllByUserIdLastMonth: findAllByUserIdLastMonth,
};
