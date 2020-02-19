const db = require("../database/connection");

const insert = (event) => {
    const query = "INSERT INTO event(name, address_id, women_only, spots, address_visible, minimum_age, " +
        "photo_id, physical, add_info, content, date, user_id) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) " +
        "RETURNING *"; // returns passed event with it's id set to corresponding id in database
    const params = [event.name, event.address_id, event.women_only, event.spots, event.address_visible,
        event.minimum_age, event.photo_id, event.physical, event.add_info, event.content, event.date, event.user_id];
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

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
};