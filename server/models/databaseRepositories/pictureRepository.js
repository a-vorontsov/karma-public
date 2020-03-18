const db = require("../../database/connection");

const insert = (picture) => {
    const query = "INSERT INTO picture(picture_location) VALUES ($1) RETURNING *";
    return db.query(query, [picture.pictureLocation]);
};

const findById = (id) => {
    const query = "SELECT * FROM picture WHERE id=$1";
    return db.query(query, [id]);
};

const update = (picture) => {
    const query = "UPDATE picture SET picture_location = $2 WHERE id = $1 RETURNING *";
    return db.query(query, [picture.id, picture.pictureLocation]);
};

const removeById = (id) => {
    const query = "DELETE FROM picture WHERE id=$1";
    return db.query(query, [id]);
};

module.exports = {
    insert,
    findById,
    update,
    removeById,
};
