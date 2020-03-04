const db = require("../../database/connection");

const insertResetToken = (user_id, token) => {
    const query = "INSERT INTO reset(user_id,password_token,expiry_date) VALUES($1,$2,$3) RETURNING *";
    const dateTime = new Date();
    dateTime.setTime(dateTime.getTime() + (1 * 60 * 60 * 1000));
    const params = [user_id, token, dateTime];
    return db.query(query, params);
};

const findResetToken = (user_id) => {
    const query = "SELECT * FROM reset WHERE user_id =$1 ORDER BY expiry_date DESC";
    const params = [user_id];
    return db.query(query, params);
};

module.exports = {
    insertResetToken: insertResetToken,
    findResetToken: findResetToken,
};
