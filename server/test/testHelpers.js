const db = require("../database/connection");

const address = {
    address_1: "221B Baker St",
    address_2: "Marleybone",
    postcode: "NW1 6XE",
    city: "London",
    region: "Greater London",
    lat: "51.523774",
    long: "-0.158534",
};

const event = {
    address: address,
    name: "Quiz of the Pub Variety",
    women_only: false,
    spots: 70,
    address_visible: true,
    minimum_age: 18,
    photo_id: true,
    physical: true,
    add_info: true,
    content: "Alcohol",
    date: "2004-10-19",
    time: "10:23:54",
};

const clearDatabase = async () => {
    await db.query("DELETE FROM event");
    await db.query("DELETE FROM address");
};

module.exports = {
    address: address,
    event: event,
    clearDatabase: clearDatabase,
};
