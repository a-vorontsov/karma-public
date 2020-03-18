const db = require("../../database/connection");

const insert = (setting) => {
    const query = "INSERT INTO setting(email, notification, user_id) VALUES ($1, $2, $3) " +
        "RETURNING *";
    const params = [setting.email, setting.notification, setting.user_id];
    return db.query(query, params);
};

const find = (id) => {
    const query = "SELECT * FROM setting WHERE id=$1";
    return db.query(query, [id]);
};

const findByUserId = (userId) => {
    const query = "SELECT * FROM setting WHERE user_id=$1";
    return db.query(query, [userId]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM setting WHERE user_id = $1";
    return db.query(query, [userId]);
}

module.exports = {
    insert,
    find,
    removeByUserId,
    findByUserId,
};
