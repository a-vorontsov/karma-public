const db = require("../../database/connection");

const insert = (organisation) => {
    const query = "INSERT INTO organisation(org_name, org_number, org_type, poc_firstname," +
        " poc_lastname, phone, banned, " +
        "org_register_date, low_income, exempt, picture_id, user_id, address_id)" +
        " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)" +
        "RETURNING *"; // returns passed organisation with it's id set to corresponding id in database
    const params = [organisation.orgName, organisation.orgNumber, organisation.orgType, organisation.pocFirstname,
        organisation.pocLastname, organisation.phone, organisation.banned, organisation.orgRegisterDate,
        organisation.lowIncome, organisation.exempt, organisation.pictureId,
        organisation.userId, organisation.addressId];
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

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findByUserID: findByUserID,
};
