const db = require("../database/connection");

const insert = (address) => {
    const query = "INSERT INTO address(address_1, address_2, postcode, city, region, lat, long) VALUES ($1, $2, $3, $4, $5, $6, $7) " +
        "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [address.address_1, address.address_2, address.postcode, address.city, address.region, address.lat, address.long];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM address WHERE id=$1";
    return db.query(query, [id]);
};

module.exports = {
    insert: insert,
    findById: findById,
};
