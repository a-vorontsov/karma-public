const db = require("../database/connection");

const registration = {
    email: "test@gmail.com",
    email_flag: 0,
    id_flag: 0,
    phone_flag: 0,
    sign_up_flag: 0,
};

const registration2 = {
    email: "test2@gmail.com",
    email_flag: 0,
    id_flag: 0,
    phone_flag: 0,
    sign_up_flag: 0,
};

const registration3 = {
    email: "test3@gmail.com",
    email_flag: 0,
    id_flag: 0,
    phone_flag: 0,
    sign_up_flag: 0,
};

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
    name: "event",
    address_id: -1,
    women_only: true,
    spots: 3,
    address_visible: true,
    minimum_age: 16,
    photo_id: true,
    physical: true,
    add_info: true,
    content: "fun event yay",
    date: "2004-10-19 10:23:54",
    user_id: -1,
};


const user = {
    email: "test@gmail.com",
    username: "test1",
    password_hash: "password",
    verified: true,
    salt: "password",
    date_registered: "2016-06-22 19:10:25-07",
};

const user2 = {
    email: "test2@gmail.com",
    username: "test2",
    password_hash: "password",
    verified: true,
    salt: "xlzljlfas",
    date_registered: "2016-06-22 19:10:25-07",
};

const user3 = {
    email: "test3@gmail.com",
    username: "test3",
    password_hash: "password",
    verified: true,
    salt: "xlzljlfas",
    date_registered: "2016-06-22 19:10:25-07",
};
const individual = {

    firstname: "Paul",
    lastname: "Muller",
    phone: "+435958934",
    banned: false,
    user_id: -1,
    picture_id: null,
    address_id: -1,
    birthday: "1998-10-09",
    gender: 'M',
};

const profile = {
    individual_id: -1,
    karma_points: 134,
    bio: "tstest xlkhtle",
    women_only: false,
};

const organisation = {

    org_name: "Charity",
    org_number: "1234AB",
    org_type: "NGO",
    poc_firstname: "Paul",
    poc_lastname: "Muller",
    phone: "+945380245",
    banned: false,
    org_register_date: "2016-10-09",
    low_income: false,
    exempt: false,
    picture_id: null,
    user_id: -1,
    address_id: -1,
};

const cause = {
    name: "cause1",
    description: "description of cause1",
};
const clearCauses = async () => {
    await db.query("DELETE FROM cause");
};

const clearDatabase = async () => {
    await db.query("DELETE FROM profile");
    await db.query("DELETE FROM event");
    await db.query("DELETE FROM organisation");
    await db.query("DELETE FROM individual");
    await db.query("DELETE FROM event");
    await db.query("DELETE FROM \"user\"");
    await db.query("DELETE FROM registration");
    await db.query("DELETE FROM cause");
};

module.exports = {
    address: address,
    registration: registration,
    registration2: registration2,
    registration3: registration3,
    event: event,
    cause: cause,
    user: user,
    user2: user2,
    user3: user3,
    individual: individual,
    profile: profile,
    organisation: organisation,
    clearDatabase: clearDatabase,
    clearCauses: clearCauses,
};
