const db = require("../database/connection");

const insert = (name, description) => {
    const query = "INSERT INTO cause(name,description) VALUES ($1, $2) " +
        "RETURNING *"; // returns passed cause with it's id set to corresponding id in database
    const params = [name, description];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM cause WHERE id=$1";
    return db.query(query, [id]);
};
const findByName = (name) => {
    const query = "SELECT * FROM cause WHERE name=$1";
    return db.query(query, [name]);
};
const getAll = () => {
    const query = "SELECT * FROM cause";
    return db.query(query);
};

module.exports = {
    insert: insert,
    findById: findById,
    findByName: findByName,
    getAll: getAll,
};
