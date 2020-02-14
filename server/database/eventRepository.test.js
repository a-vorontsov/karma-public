const db = require("./connection");
const eventRepository = require("./eventRepository");

beforeEach(() => {
    db.query("DELETE FROM event");
    db.query("DELETE FROM address");
});

afterEach(() => {
    db.query("DELETE FROM event");
    db.query("DELETE FROM address");
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
    const event = {
        address: address,
        name: "event",
        organization_id: 3,
        address_id: 3,
        women_only: true,
        spots: 3,
        address_visible: true,
        minimum_age: 16,
        photo_id: true,
        physical: true,
        add_info: true,
        content: "fun event yay",
        date: "2004-10-19",
        time: "10:23:54"
    };
    const insertEventResult = await eventRepository.insert(event);
    const findEventResult = await eventRepository.findById(insertEventResult.rows[0].id);
    expect(insertEventResult.rows[0]).toMatchObject(findEventResult.rows[0]);
});