const db = require("../database/connection");

const insert = (event) => {
    const query = "INSERT INTO event(name, address_id, women_only, spots, address_visible, minimum_age, " +
        "photo_id, physical, add_info, content, date, user_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) " +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.address_id, event.women_only, event.spots, event.address_visible,
        event.minimum_age, event.photo_id, event.physical, event.add_info, event.content, event.date, event.user_id,
    ];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM event WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM event";
    return db.query(query);
};

const update = (event) => {
    const query = "UPDATE event SET name = $1, address_id = $2, women_only = $3, spots = $4, address_visible = $5, " +
        "minimum_age = $6, photo_id = $7, physical = $8, add_info = $9, content = $10, " +
        "date = $11, user_id = $12 WHERE id = $13" +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.address_id, event.women_only, event.spots, event.address_visible,
        event.minimum_age, event.photo_id, event.physical, event.add_info, event.content, event.date, event.user_id, event.id,
    ];
    return db.query(query, params);
};

const getEventsWithLocation = () => {
    const query = "select id(event) as event_id,name,women_only,spots,address_visible,minimum_age,photo_id," +
        "physical,add_info,content,date,user_id as event_creator_id,address_1,address_2,postcode,city,region,lat,long " +
        "from address right join event on id(address) = address_id";
    return db.query(query);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    update: update,
    getEventsWithLocation: getEventsWithLocation,
};
