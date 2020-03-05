const db = require("../../database/connection");

const insert = (organisation) => {
    const query = "INSERT INTO organisation(org_name, org_number, org_type, poc_firstname," +
        " poc_lastname, phone, banned, " +
        "org_register_date, low_income, exempt, picture_id, user_id, address_id)" +
        " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)" +
        "RETURNING *"; // returns passed organisation with it's id set to corresponding id in database
    const params = [organisation.org_name, organisation.org_number, organisation.org_type, organisation.poc_firstname,
        organisation.poc_lastname, organisation.phone, organisation.banned, organisation.org_register_date,
        organisation.low_income, organisation.exempt, organisation.picture_id,
        organisation.user_id, organisation.address_id];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM organisation WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM organisation";
    return db.query(query);
};

const findByUserID = (userId) => {
    const query = "SELECT * FROM organisation WHERE user_id=$1";
    return db.query(query, [userId]);
};

const update = (organisation) => {
    const query =
    "UPDATE organisation SET org_name = $1, org_number = $2, org_type = $3, poc_firstname = $4, " +
    "poc_lastname = $5, phone = $6, banned = $7, org_register_date = $8, low_income = $9, " +
    "exempt = $10, picture_id = $11, user_id = $12, address_id = $13 WHERE id = $14" +
    "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [
        organisation.org_name,
        organisation.org_number,
        organisation.org_type,
        organisation.poc_firstname,
        organisation.poc_lastname,
        organisation.phone,
        organisation.banned,
        organisation.org_register_date,
        organisation.low_income,
        organisation.exempt,
        organisation.picture_id,
        organisation.user_id,
        organisation.address_id,
        organisation.id,
    ];
    return db.query(query, params);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findByUserID: findByUserID,
    update: update,
};
