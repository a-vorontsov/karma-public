const db = require("./connection");
const addressRepository = require("./addressRepository");

afterEach(() => {
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
    const insertResult = await addressRepository.insert(address);
    const findResult = await addressRepository.findById(insertResult.rows[0].id);
    expect(insertResult.rows[0]).toMatchObject(findResult.rows[0]);
});