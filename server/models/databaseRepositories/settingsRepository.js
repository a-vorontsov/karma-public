const db = require("../../database/connection");

const insert = (setting) => {
    const query = "INSERT INTO setting(email, notifications, user_id) VALUES ($1, $2, $3) " +
        "RETURNING *";
    const params = [setting.email, setting.notifications, setting.userId];
    return db.query(query, params);
};

const insertUserId = (userId) => {
    const query = "INSERT INTO setting(user_id) VALUES ($1) " +
        "RETURNING *";
    return db.query(query, [userId]);
};

const findByUserId = (userId) => {
    const query = "SELECT email(\"user\"), email(setting) as promotional_emails,notifications "+
    "FROM setting INNER JOIN \"user\" on user_id(setting) = id(\"user\") WHERE user_id=$1";
    return db.query(query, [userId]);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM setting WHERE user_id = $1 RETURNING *";
    return db.query(query, [userId]);
};

const update = (setting) => {
    const query = "UPDATE setting SET email = $1, notifications = $2 WHERE user_id = $3 RETURNING *";
    const params = [setting.email, setting.notifications, setting.userId];
    return db.query(query, params);
};

module.exports = {
    insert,
    removeByUserId,
    findByUserId,
    insertUserId,
    update,
};
