const db = require("../database/connection");
const eventRepository = require("./eventRepository");
const addressRepository = require("./addressRepository");
const userRepository = require("./userRepository");

beforeEach(() => {
    db.query("DELETE FROM event");
    db.query("DELETE FROM address");
    db.query("DELETE FROM \"user\"");
});

afterEach(() => {
    db.query("DELETE FROM event");
    db.query("DELETE FROM address");
    db.query("DELETE FROM \"user\"");
});

test('insert and findById work', async () => {
    const address = {
        address_1: "Line 1",
        address_2: "Line 2",
        postcode: "14 aa",
        city: "LDN",
        region: "LDN again",
        lat: "0.3",
        long: "0.5"
    };

    const insertAddressResult = await addressRepository.insert(address);

    const user = {
        email: "test@gmail.com",
        username: "test1",
        password_hash: "password",
        verified: true,
        salt: "password",
        date_registered: "2016-06-22 19:10:25-07",
    };
    const insertUserResult = await userRepository.insert(user);

    const event = {
        name: "event",
        address_id: insertAddressResult.rows[0].id,
        women_only: true,
        spots: 3,
        address_visible: true,
        minimum_age: 16,
        photo_id: true,
        physical: true,
        add_info: true,
        content: "fun event yay",
        date: "2004-10-19 10:23:54",
        user_id: insertUserResult.rows[0].id,
    };
    const insertEventResult = await eventRepository.insert(event);
    const findEventResult = await eventRepository.findById(insertEventResult.rows[0].id);
    expect(insertEventResult.rows[0]).toMatchObject(findEventResult.rows[0]);
});