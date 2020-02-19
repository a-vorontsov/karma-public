const db = require("../database/connection");

const insert = (profile) => {
    const query = "INSERT INTO profile(individual_id, karma_points, bio, women_only) VALUES ($1, $2, $3, $4)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [profile.individual_id, profile.karma_points, profile.bio, profile.women_only];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM profile WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM profile";
    return db.query(query);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
};
