const db = require("../database/connection");
const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const profileRepository = require("./profileRepository");

beforeEach(() => {
    db.query("DELETE FROM individual");
    db.query("DELETE FROM \"user\"");
    db.query("DELETE FROM address");
    db.query("DELETE FROM profile");


});

afterEach(() => {
    db.query("DELETE FROM individual");
    db.query("DELETE FROM \"user\"");
    db.query("DELETE FROM address");
    db.query("DELETE FROM profile");
});

test('insert profile and findById profile work', async () => {
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
    const profile = {
        individual_id: insertIndividualResult.rows[0].id,
        karma_points: 134,
        bio: "tstest xlkhtle",
        women_only: false,
    }

    const insertProfileResult = await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findById(insertProfileResult.rows[0].id);
    expect(insertProfileResult.rows[0]).toMatchObject(findProfileResult.rows[0]);
});