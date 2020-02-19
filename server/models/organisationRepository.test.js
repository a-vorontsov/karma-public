const db = require("../database/connection");
const userRepository = require("./userRepository");
const organisationRepository = require("./organisationRepository");
const addressRepository = require("./addressRepository");

beforeEach(() => {
    db.query("DELETE FROM organisation");
    db.query("DELETE FROM \"user\"");
    db.query("DELETE FROM address");


});

afterEach(() => {
    db.query("DELETE FROM organisation");
    db.query("DELETE FROM \"user\"");
    db.query("DELETE FROM address");
});

test('insert organisation and findById organisation work', async () => {
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

    const organisation = {

        org_name: "Charity",
        org_number: "1234AB",
        org_type: "NGO",
        poc_firstname: "Paul",
        poc_lastname: "Muller" ,
        phone: "+945380245",
        banned: false,
        org_register_date: "2016-10-09",
        low_income: false,
        exempt: false,
        picture_id: null,
        user_id: insertUserResult.rows[0].id,
        address_id: insertAddressResult.rows[0].id,
    };
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findById(insertOrganisationResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});