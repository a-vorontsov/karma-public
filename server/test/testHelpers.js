const db = require("../database/connection");

const registrationExample1 = {
    email: "test@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const notification = {
    type: "Cancel",
    message: "Cancel Cancel",
    timestampSent: new Date(),
    senderId: -1,
    receiverId: -1,
};

const getNotification = () => ({...notification});

const getRegistrationExample1 = () => ({...registrationExample1});

const registrationExample2 = {
    email: "test2@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const getRegistrationExample2 = () => ({...registrationExample2});

const registrationExample3 = {
    email: "test3@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const getRegistrationExample3 = () => ({...registrationExample3});

const registrationExample4 = {
    email: "test4@gmail.com",
    emailFlag: 0,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const getRegistrationExample4 = () => ({...registrationExample4});

const registrationExample5 = {
    email: "test4@gmail.com",
    emailFlag: 1,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 0,
};

const getRegistrationExample5 = () => ({...registrationExample5});

const registrationExample6 = {
    email: "test4@gmail.com",
    emailFlag: 1,
    idFlag: 0,
    phoneFlag: 0,
    signUpFlag: 1,
};

const getRegistrationExample6 = () => ({...registrationExample6});

const address = {
    address1: "221B Baker St",
    address2: "Marleybone",
    postcode: "NW1 6XE",
    city: "London",
    region: "Greater London",
    lat: 51.523774,
    long: -0.158534,
};

const getAddress = () => ({...address});


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

const getEvent = () => ({...event});

const userExample1 = {
    email: "test@gmail.com",
    username: "test1",
    passwordHash: "password",
    verified: true,
    salt: "password",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample1 = () => ({...userExample1});


const authenticationExample1 = {
    token: "thisIsASecureToken",
    expiryDate: "2020-01-22 19:10:25-07",
    creationDate: "2020-01-10 19:10:25-07",
    userId: -1,
};

const getAuthenticationExample1 = () => ({...authenticationExample1});

const authenticationExample2 = {
    token: "thisIsANonSecureToken",
    expiryDate: "2020-01-10 19:10:25-07",
    creationDate: "2019-12-23 19:10:25-07",
    userId: -1,
};

const getAuthenticationExample2 = () => ({...authenticationExample2});

const userExample2 = {
    email: "test2@gmail.com",
    username: "test2",
    passwordHash: "password",
    verified: true,
    salt: "xlzljlfas",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample2 = () => ({...userExample2});

const userExample3 = {
    email: "test3@gmail.com",
    username: "test3",
    passwordHash: "password",
    verified: true,
    salt: "xlzljlfas",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample3 = () => ({...userExample3});

const userExample4 = {
    email: "test4@gmail.com",
    username: "test4",
    passwordHash: "bd25f93e765c380a414d1cb7887a9cfcf5394fbc36443810256df3ce39f7ab32",
    verified: false,
    salt: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    dateRegistered: "2016-06-22 19:10:25-07",
};

const getUserExample4 = () => ({...userExample4});

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

const getIndividual = () => ({...individual});

const profile = {
    individualId: -1,
    karmaPoints: 134,
    bio: "tstest xlkhtle",
    womenOnly: false,
};

const getProfile = () => ({...profile});

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

const getOrganisation = () => ({...organisation});

const cause = {
    name: "cause1",
    description: "description of cause1",
    title: "test",
};

const getCause = () => ({...cause});

const signUp = {
    individualId: -1,
    eventId: -1,
    confirmed: true,
};

const getSignUp = () => ({...signUp});

const favourite = {
    individualId: -1,
    eventId: -1,
};

const getFavourite = () => ({...favourite});

const eventWithLocationExample1 = {
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

const getEventWithLocationExample1 = () => ({...eventWithLocationExample1});

const eventWithLocationExample2 = {
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

const getEventWithLocationExample2 = () => ({...eventWithLocationExample2});

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

const getWomenOnlyEvent = () => ({...womenOnlyEvent});

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

const getPhysicalEvent = () => ({...physicalEvent});

const signedUpUserExample1 = {
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

const getSignedUpUserExample1 = () => ({...signedUpUserExample1});

const signedUpUserExample2 = {
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

const getSignedUpUserExample2 = () => ({...signedUpUserExample2});

const resetExample1 = {
    userId: 1,
    passwordToken: "123456",
};

const getResetExample1 = () => ({...resetExample1});

const resetExample2 = {
    userId: 1,
    passwordToken: "234567",
};

const getResetExample2 = () => ({...resetExample2});

const clearDatabase = async () => {
    await db.query("DELETE FROM notification");
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
    getAddress: getAddress,
    getAuthenticationExample1: getAuthenticationExample1,
    getAuthenticationExample2: getAuthenticationExample2,
    getRegistrationExample1: getRegistrationExample1,
    getRegistrationExample2: getRegistrationExample2,
    getRegistrationExample3: getRegistrationExample3,
    getRegistrationExample4: getRegistrationExample4,
    getRegistrationExample5: getRegistrationExample5,
    getRegistrationExample6: getRegistrationExample6,
    getEvent: getEvent,
    getCause: getCause,
    getSignUp: getSignUp,
    getUserExample1: getUserExample1,
    getUserExample2: getUserExample2,
    getUserExample3: getUserExample3,
    getUserExample4: getUserExample4,
    getIndividual: getIndividual,
    getProfile: getProfile,
    getOrganisation: getOrganisation,
    getSignedUpUserExample1: getSignedUpUserExample1,
    getSignedUpUserExample2: getSignedUpUserExample2,
    getResetExample1: getResetExample1,
    getResetExample2: getResetExample2,
    getEventWithLocationExample1: getEventWithLocationExample1,
    getEventWithLocationExample2: getEventWithLocationExample2,
    getWomenOnlyEvent: getWomenOnlyEvent,
    getFavourite: getFavourite,
    getPhysicalEvent: getPhysicalEvent,
    clearDatabase: clearDatabase,
    getNotification: getNotification,
};
