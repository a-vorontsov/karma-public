const db = require("../../database/connection");

const insert = (cause) => {
    const query = "INSERT INTO cause(name,description) VALUES ($1, $2) " +
        "RETURNING *"; // returns passed cause with it's id set to corresponding id in database
    const params = [cause.name, cause.description];
    return db.query(query, params);
};

const findById = async (id) => {
    const query = "SELECT * FROM cause WHERE id=$1";
    const queryResult = await db.query(query, [id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No cause with id ${id} exists`);
    }
    return queryResult;
};
const findByName = async (name) => {
    const query = "SELECT * FROM cause WHERE name=$1";
    const queryResult = await db.query(query, [name]);
    if(queryResult.rowCount === 0) {
        throw Error(`No cause with name ${name} exists`);
    }
    return queryResult;
};
const findAll = async () => {
    const query = "SELECT * FROM cause";
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No cause exists`);
    }
    return queryResult;
};

module.exports = {
    insert: insert,
    findById: findById,
    findByName: findByName,
    findAll: findAll,
};
