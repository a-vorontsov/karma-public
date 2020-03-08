const db = require("../database/connection");

const registration = {
    email: "test@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const registration2 = {
    email: "test2@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const registration3 = {
    email: "test3@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const registration4 = {
    email: "test4@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const registration5 = {
    email: "test4@gmail.com",
    emailFlag: 1,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const registration6 = {
    email: "test4@gmail.com",
    emailFlag: 1,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 1,
};

const address = {
    address1: "221B Baker St",
    address2: "Marleybone",
    postcode: "NW1 6XE",
    city: "London",
    region: "Greater London",
    lat: 51.523774,
    long: -0.158534,
};

const event = {
    name: "event",
    addressId: -1,
    womenOnly: true,
    spots: 3,
    addressVisible: true,
    minimumAge: 16,
    photoId: true,
    physical: true,
    addInfo: true,
    content: "fun event yay",
    date: "2004-10-19 10:23:54",
    userId: -1,
    creationDate: "2019-10-19 10:23:54",
};


const user = {
    email: "test@gmail.com",
    username: "test1",
    passwordHash: "password",
    verified: true,
    salt: "password",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const authentication = {
    token: "thisIsASecureToken",
    expiryDate: "2020-01-22 19:10:25-07",
    creationDate: "2020-01-10 19:10:25-07",
    userId: -1,
};

const authentication2 = {
    token: "thisIsANonSecureToken",
    expiryDate: "2020-01-10 19:10:25-07",
    creationDate: "2019-12-23 19:10:25-07",
    userId: -1,
};

const user2 = {
    email: "test2@gmail.com",
    username: "test2",
    passwordHash: "password",
    verified: true,
    salt: "xlzljlfas",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const user3 = {
    email: "test3@gmail.com",
    username: "test3",
    passwordHash: "password",
    verified: true,
    salt: "xlzljlfas",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const user4 = {
    email: "test4@gmail.com",
    username: "test4",
    passwordHash: "bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32",
    verified: true,
    salt: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const individual = {

    firstname: "Paul",
    lastname: "Muller",
    phone: "+435958934",
    banned: false,
    userId: -1,
    pictureId: null,
    addressId: -1,
    birthday: "1998-10-09",
    gender: 'M',
};

const profile = {
    individualId: -1,
    karmaPoints: 134,
    bio: "tstest xlkhtle",
    womenOnly: false,
};

const organisation = {

    orgName: "Charity",
    orgNumber: "1234AB",
    orgType: "NGO",
    pocFirstname: "Paul",
    pocLastname: "Muller",
    phone: "+945380245",
    banned: false,
    orgRegisterDate: "2016-10-09",
    lowIncome: false,
    exempt: false,
    pictureId: null,
    userId: -1,
    addressId: -1,
};

const cause = {
    name: "cause1",
    description: "description of cause1",
    title: "test",
};

const signUp = {
    individualId: -1,
    eventId: -1,
    confirmed: true,
};

const favourite = {
    individualId: -1,
    eventId: -1,
};

const eventWithLocation1 = {
    id: 3,
    name: "Staying at Home",
    addressId: 1,
    womenOnly: false,
    spots: 1,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    addInfo: false,
    content: "sleeping at home",
    date: "2020-03-25T19:10:00.000Z",
    causeId: 3,
    causeName: "peace",
    causeDescription: "not dealing with people",
    eventCreatorId: 1,
    address1: "pincot road",
    address2: null,
    postcode: "SW19 2LF",
    city: "London",
    region: null,
    lat: "51.4149160",
    long: "-0.1904870",
};

const eventWithLocation2 = {
    id: 1,
    name: "Close to Home",
    addressId: 3,
    womenOnly: false,
    spots: 3,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    addInfo: false,
    content: "very very close from home",
    date: "2020-03-25T19:10:00.000Z",
    causeId: 1,
    causeName: "gardening",
    causeDescription: "watering plants and dat",
    eventCreatorId: 1,
    address1: "nearby road",
    address2: null,
    postcode: "whatever",
    city: "London",
    region: null,
    lat: "51.4161220",
    long: "-0.1866410",
};

const womenOnlyEvent = {
    id: 4,
    name: "Women Only Event",
    addressId: 3,
    womenOnly: true,
    spots: 3,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    addInfo: false,
    content: "just doing women stuff",
    date: "2020-03-25T19:10:00.000Z",
    causeId: 1,
    causename: "gardening",
    causedescription: "watering plants and dat",
    eventCreatorId: 1,
    address1: "nearby road",
    address2: null,
    postcode: "whatever",
    city: "London",
    region: null,
    lat: "51.4161220",
    long: "-0.1866410",
};

const physicalEvent = {
    id: 5,
    name: "Physical",
    addressId: 3,
    womenOnly: false,
    spots: 3,
    addressVisible: true,
    minimumAge: 18,
    photoId: false,
    physical: true,
    addInfo: false,
    content: "doing stuff that make you sweat",
    date: "2020-03-25T19:10:00.000Z",
    causeId: 1,
    causeName: "gardening",
    causeDescription: "watering plants and dat",
    eventCreatorId: 1,
    address1: "nearby road",
    address2: null,
    postcode: "whatever",
    city: "London",
    region: null,
    lat: "51.4161220",
    long: "-0.1866410",
};

const signedUpUser1 = {
    eventId: 1,
    individualId: 1,
    confirmed: true,
    firstname: "fname",
    lastname: "lname",
    userId: 677,
    email: "test@gmail.com",
    username: "test1",
    dateRegistered: "2016-06-22T18:10:25.000Z",
};
const signedUpUser2 = {
    eventId: 1,
    individualId: 2,
    confirmed: true,
    firstname: "fname2",
    lastname: "lname2",
    userId: 678,
    email: "test2@gmail.com",
    username: "test2",
    dateRegistered: "2016-06-22T18:10:25.000Z",
};

const reset1 = {
    userId: 1,
    passwordToken: "123456",
};
const reset2 = {
    userId: 1,
    passwordToken: "234567",
};

const clearDatabase = async () => {
    await db.query("DELETE FROM complaint");
    await db.query("DELETE FROM report_user");
    await db.query("DELETE FROM setting");
    await db.query("DELETE FROM profile");
    await db.query("DELETE FROM sign_up");
    await db.query("DELETE FROM favourite");
    await db.query("DELETE FROM event_cause");
    await db.query("DELETE FROM organisation");
    await db.query("DELETE FROM individual");
    await db.query("DELETE FROM event");
    await db.query("DELETE FROM authentication");
    await db.query("DELETE FROM selected_cause");
    await db.query("DELETE FROM reset");
    await db.query("DELETE FROM \"user\"");
    await db.query("DELETE FROM registration");
    await db.query("DELETE FROM cause");
    await db.query("DELETE FROM address");
};

module.exports = {
    address: address,
    registration: registration,
    registration2: registration2,
    authentication: authentication,
    authentication2: authentication2,
    registration3: registration3,
    registration4: registration4,
    registration5: registration5,
    registration6: registration6,
    event: event,
    cause: cause,
    user: user,
    user2: user2,
    user3: user3,
    user4: user4,
    individual: individual,
    profile: profile,
    organisation: organisation,
    signUp: signUp,
    clearDatabase: clearDatabase,
    eventWithLocation1: eventWithLocation1,
    eventWithLocation2: eventWithLocation2,
    womenOnlyEvent: womenOnlyEvent,
    physicalEvent: physicalEvent,
    favourite: favourite,
    signedUpUser1: signedUpUser1,
    signedUpUser2: signedUpUser2,
    reset1: reset1,
    reset2: reset2,
};
