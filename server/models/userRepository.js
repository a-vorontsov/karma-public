const db = require("../database/connection");

const insert = (user) => {
    const query = "INSERT INTO \"user\"(email, username, password_hash, verified, salt, date_registered) VALUES ($1, $2, $3, $4, $5, $6)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [user.email, user.username, user.password_hash, user.verified, user.salt, user.date_registered];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM \"user\" WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM \"user\"";
    return db.query(query);
};

const findByEmail = (email) => {
    const query = "SELECT * FROM \"user\" WHERE email=$1";
    return db.query(query, [email]);
};

const findByUsername = (username) => {
    const query = "SELECT * FROM \"user\" WHERE username=$1";
    return db.query(query, [username]);
};


module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findByEmail: findByEmail,
    findByUsername: findByUsername,
};
