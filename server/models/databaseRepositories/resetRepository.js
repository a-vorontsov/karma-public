const db = require("../../database/connection");

const insertResetToken = (userId, token, expiryDate) => {
    const query = "INSERT INTO reset(user_id,password_token,expiry_date) VALUES($1,$2,$3) RETURNING *";
    const params = [userId, token, expiryDate];
    return db.query(query, params);
};

const findLatestByUserID = (userId) => {
    const query = "SELECT * FROM reset WHERE user_id =$1 ORDER BY expiry_date DESC LIMIT 1";
    const params = [userId];
    return db.query(query, params);
};

module.exports = {
    insertResetToken: insertResetToken,
    findLatestByUserID: findLatestByUserID,
};
