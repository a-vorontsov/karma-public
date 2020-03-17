const db = require("../../database/connection");

const insert = (individual) => {
    const query = "INSERT INTO individual(firstname, lastname, phone, banned, " +
        "user_id, picture_id, address_id, birthday, gender) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [individual.firstname, individual.lastname, individual.phone,
        individual.banned, individual.userId, individual.pictureId,
        individual.addressId, individual.birthday, individual.gender,
    ];
    return db.query(query, params);
};

const findById = (id) => {
    const query = "SELECT * FROM individual WHERE id=$1";
    return db.query(query, [id]);
};

const findAll = () => {
    const query = "SELECT * FROM individual";
    return db.query(query);
};

const findByUserID = (userId) => {
    const query = "SELECT * FROM individual WHERE user_id=$1";
    return db.query(query, [userId]);
};

const findFavouriteEvents = (userId) => {
    const query = "SELECT id(event) as eventId, name, women_only, spots, address_visible as addressVisible, " +
        "minimum_age AS minimumAge, photo_id as photoId, physical, add_info as addInfo, content, date, user_id as eventCreatorId, " +
        "address1, address2, postcode, city, region, lat, long " +
        "FROM favourite LEFT JOIN event ON event_id = id(event) left join address on id(address) = address_id where user_id = $1";
    return db.query(query, [userId]);
};

const findGoingEvents = (userId) => {
    const now = new Date();
    const query = "SELECT id(event) as eventId, name, women_only, spots, address_visible as addressVisible, " +
        "minimum_age AS minimumAge, photo_id as photoId, physical, add_info as addInfo, content, date, user_id as eventCreatorId, " +
        "address1, address2, postcode, city, region, lat, long " +
        "FROM sign_up left join event on event_id = id(event)" +
        "left join address on id(address) = address_id where user_id = $1 and confirmed = true AND date >= $2";
    return db.query(query, [userId, now]);
};

const update = (individual) => {
    const query =
    "UPDATE individual SET firstname = $1, lastname = $2, phone = $3, banned = $4, " +
    "picture_id = $5, address_id = $6, birthday = $7, gender = $8 WHERE id = $9" +
    "RETURNING *"; // returns passed address with it's id set to corresponding id in database
    const params = [
        individual.firstname,
        individual.lastname,
        individual.phone,
        individual.banned,
        individual.pictureId,
        individual.addressId,
        individual.birthday,
        individual.gender,
        individual.id,
    ];
    return db.query(query, params);
};

const removeByUserId = (userId) => {
    const query = "DELETE FROM individual WHERE user_id=$1";
    return db.query(query, [userId]);
};

module.exports = {
    insert,
    findById,
    findAll,
    findByUserID,
    findFavouriteEvents,
    findGoingEvents,
    update,
    removeByUserId,
};
