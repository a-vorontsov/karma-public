const userRepository = require("../user");
const individualRepository = require("./");
const addressRepository = require("../address");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");
const eventRepository = require("../event");
const favouriteRepository = require("../favourite");
const signUpRepository = require("../event/signup");

let registrationExample1, userExample1, address, individual, event, favourite, signUp;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    individual = testHelpers.getIndividual();
    event = testHelpers.getEvent();
    favourite = testHelpers.getFavourite();
    signUp = testHelpers.getSignUp();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert individual and findById individual work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findById(insertIndividualResult.rows[0].id);
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});

test('getIndividualId works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualId = await individualRepository.getIndividualId(individual.userId);
    expect(insertIndividualResult.rows[0].id).toBe(findIndividualId.rows[0].id);
});

test('getIndividualLocation works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    await individualRepository.insert(individual);
    const findIndividualLocation = await individualRepository.getIndividualLocation(individual.userId);
    expect(findIndividualLocation.rows[0].lat).toBe(insertAddressResult.rows[0].lat);
    expect(findIndividualLocation.rows[0].long).toBe(insertAddressResult.rows[0].long);
});

test('insert individual and findAll work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findAll();
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});

test('insert individual and findByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findByUserID(individual.userId);
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});

test('insert individual and removeByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findByUserID(individual.userId);
    const deleteIndividualResult = await individualRepository.removeByUserId(individual.userId);
    const findIndividualResultAfterDeletion = await individualRepository.findByUserID(individual.userId);
    expect(findIndividualResult.rows[0]).toMatchObject(deleteIndividualResult.rows[0]);
    expect(findIndividualResultAfterDeletion.rowCount).toBe(0);
});

test('insert individual and update work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    individual.lastname = "New Name";
    individual.id = insertIndividualResult.rows[0].id;
    const updateResult = await individualRepository.update(individual);
    const findIndividualResult = await individualRepository.findByUserID(individual.userId);
    expect(insertIndividualResult.rows[0].lastname).not.toBe(updateResult.rows[0].lastname);
    expect(findIndividualResult.rows[0].lastname).toBe(updateResult.rows[0].lastname);
});

test('insert individual and findFavouriteEvents work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    favourite.individualId = insertIndividualResult.rows[0].id;
    favourite.eventId = insertEventResult.rows[0].id;
    await favouriteRepository.insert(favourite);
    const findFavourite = await individualRepository.findFavouriteEvents(individual.userId);
    expect(findFavourite.rowCount).toBe(1);
    expect(findFavourite.rows[0].eventId).toBe(favourite.eventId);
    expect(findFavourite.rows[0].postcode).toBe(insertAddressResult.rows[0].postcode);
});

test('insert individual and findGoingEvents work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    event.date = '3000-10-19 10:23:54';
    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    signUp.individualId = insertIndividualResult.rows[0].id;
    signUp.eventId = insertEventResult.rows[0].id;
    await signUpRepository.insert(signUp);
    const findGoing = await individualRepository.findGoingEvents(individual.userId);
    expect(findGoing.rowCount).toBe(1);
    expect(findGoing.rows[0].eventId).toBe(signUp.eventId);
    expect(findGoing.rows[0].postcode).toBe(insertAddressResult.rows[0].postcode);
});
