const db = require("../database/connection");

const insert = (individual) => {
    const query = "INSERT INTO individual(firstname, lastname, phone, banned, " +
        "user_id, picture_id, address_id, birthday, gender) " +
        "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)" +
        "RETURNING *"; // returns passed user with it's id set to corresponding id in database
    const params = [individual.firstname, individual.lastname, individual.phone,
        individual.banned, individual.user_id, individual.picture_id,
        individual.address_id, individual.birthday, individual.gender
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

const findByUserID = (user_id) => {
    const query = "SELECT * FROM individual WHERE user_id=$1";
    return db.query(query, [user_id]);
};

const findFavouriteEvents = (userId) => {
    const query = "select id(event) as event_id,name,women_only,spots,address_visible,minimum_age,photo_id," +
        "physical,add_info,content,date,user_id as event_creator_id,address_1,address_2,postcode,city,region,lat,long " +
        "from favourite left join event on event_id = id(event) left join address on id(address) = address_id where individual_id = $1";
    return db.query(query, [userId]);
};

const findGoingEvents = (userId) => {
    const query = "select id(event) as event_id,name,women_only,spots,address_visible,minimum_age,photo_id," +
        "physical,add_info,content,date,user_id as event_creator_id,address_1,address_2,postcode,city,region,lat,long " +
        "from sign_up left join event on event_id = id(event)" +
        "left join address on id(address) = address_id where individual_id = $1 and confirmed = true";
    return db.query(query, [userId]);
};

module.exports = {
    insert: insert,
    findById: findById,
    findAll: findAll,
    findByUserID: findByUserID,
    findFavouriteEvents: findFavouriteEvents,
    findGoingEvents: findGoingEvents,
};
