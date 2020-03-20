const db = require("../../database/connection");

const insert = (setting) => {
    const query = "INSERT INTO setting(email, notifications, user_id) VALUES ($1, $2, $3) " +
        "RETURNING *";
    const params = [setting.email, setting.notifications, setting.userId];
    return db.query(query, params);
};

const findByUserId = (userId) => {
    const query = "SELECT * FROM setting WHERE user_id=$1";
    return db.query(query, [userId]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM setting WHERE user_id = $1 RETURNING *";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    removeByUserId,
    findByUserId,
};
