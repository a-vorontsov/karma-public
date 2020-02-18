const db = require("../database/connection");

const insert = (userID, causeID) => {
    const query = "INSERT INTO selected_cause VALUES ($1, $2) " +
        "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [userID, causeID];
    return db.query(query, params);
};

const insertMultiple = (userID, causes) => {
    const query = "INSERT INTO selected_cause SELECT $1 id, x FROM unnest($2::int[]) x "+
    "RETURNING *";
    const params = [userID, causes];
    return db.query(query, params);
};

const deleteMultiple = (userID, causes) =>{
    const query = "delete from selected_cause where cause_id NOT IN (select * FROM unnest($2::int[])) and user_id = $1"+
    "RETURNING *";
    const params = [userID, causes];
    return db.query(query, params);
};

// const findById = (id) => {
//     const query = "SELECT * FROM address WHERE id=$1";
//     return db.query(query, [id]);
// };

// const update = (address) => {
//     const query = "UPDATE address SET address_1 = $1, address_2 = $2, postcode = $3, city = $4, region = $5, " +
//         "lat = $6, long = $7 WHERE id = $8" +
//         "RETURNING *"; // returns passed event with it's id set to corresponding id in database
//     const params = [address.address_1, address.address_2, address.postcode, address.city, address.region, address.lat,
//         address.long, address.id];
//     return db.query(query, params);
// };

module.exports = {
    insertSingle: insert,
    insertMultiple: insertMultiple,
    deleteMultiple: deleteMultiple,
};
