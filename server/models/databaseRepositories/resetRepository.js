const db = require("../../database/connection");

// TODO: pass object
const insertResetToken = (userId, token, expiryDate) => {
    const query = "INSERT INTO reset(user_id,password_token,expiry_date) VALUES($1,$2,$3) RETURNING *";
    const params = [userId, token, expiryDate];
    return db.query(query, params);
};

const findLatestByUserId = (userId) => {
    const query = "SELECT * FROM reset WHERE user_id =$1 ORDER BY expiry_date DESC LIMIT 1";
    const params = [userId];
    return db.query(query, params);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM reset WHERE user_id =$1";
    const params = [userId];
    return db.query(query, params);
};

module.exports = {
    insertResetToken,
    findLatestByUserId,
    removeByUserId,
};
