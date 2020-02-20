const db = require("../database/connection");

const insert = (individual) => {
    const query = "INSERT INTO individual(firstname, lastname, phone, banned, " +
        "user_id, picture_id, address_id, birthday, gender) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [individual.firstname, individual.lastname, individual.phone,
        individual.banned, individual.user_id, individual.picture_id,
        individual.address_id, individual.birthday, individual.gender];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM individual WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM individual";
    return db.query(query);
};

const findByUserID = (user_id) => {
    const query = "SELECT * FROM individual WHERE user_id=$1";
    return db.query(query, [user_id]);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findByUserID: findByUserID,
};
