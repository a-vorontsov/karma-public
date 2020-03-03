const db = require("../../database/connection");

const insert = (profile) => {
    const query = "INSERT INTO profile(individual_id, karma_points, bio, women_only) VALUES ($1, $2, $3, $4)" +
        "RETURNING *"; // returns passed profile with it's id set to corresponding id in database
    const params = [profile.individual_id, profile.karma_points, profile.bio, profile.women_only];
    return db.query(query, params);
};

const findById = async (id) => {
    const query = "SELECT * FROM profile WHERE id=$1";
    const queryResult = await db.query(query, [id]);
    if(queryResult.rowCount === 0) {
        throw Error(`No profile with id ${id} exists`);
    }
    return queryResult;
};

const findByIndividualId = async (individualId) => {
    const query = "SELECT * FROM profile WHERE individual_id=$1";
    const queryResult = await db.query(query, [individualId]);
    if(queryResult.rowCount === 0) {
        throw Error(`No profile with individual_id ${individualId} exists`);
    }
    return queryResult;
};

const findAll = async () => {
    const query = "SELECT * FROM profile";
    const queryResult = await db.query(query);
    if(queryResult.rowCount === 0) {
        throw Error(`No profile exists`);
    }
    return queryResult;
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findByIndividualId: findByIndividualId,
};
