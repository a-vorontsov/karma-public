const db = require("../database/connection");
const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");

beforeEach(() => {
    db.query("DELETE FROM individual");
    db.query("DELETE FROM \"user\"");
    db.query("DELETE FROM address");


});

afterEach(() => {
    db.query("DELETE FROM individual");
    db.query("DELETE FROM \"user\"");
    db.query("DELETE FROM address");
});

test('insert individual and findById individual work', async () => {
    const user = {
        email: "test@gmail.com",
        username: "test1",
        password_hash: "password",
        verified: true,
        salt: "password",
        date_registered: "2016-06-22 19:10:25-07",
    };
    const insertUserResult = await userRepository.insert(user);

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

    const individual = {

        firstname: "Paul",
        lastname: "Muller",
        phone: "+435958934",
        banned: false,
        user_id: insertUserResult.rows[0].id,
        picture_id: null,
        address_id: insertAddressResult.rows[0].id,
        birthday: "1998-10-09",
        gender: 'M',
    };
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findById(insertIndividualResult.rows[0].id);
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});