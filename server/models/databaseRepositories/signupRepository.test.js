const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");
const eventRepository = require("./eventRepository");
const signupRepository = require("./signupRepository");

const registration = testHelpers.registration;
const user = testHelpers.user;
const address = testHelpers.address;
const individual = testHelpers.individual;
const event = testHelpers.event;
const signUp = testHelpers.signUp;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    individual.addressId = -1;
    individual.userId = -1;
    user.email = "";
    event.addressId = -1;
    event.userId = -1;
    signUp.eventId = -1;
    signUp.individualId = -1;
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.eventId = insertEventResult.rows[0].id;
    signUp.individualId = insertIndividualResult.rows[0].id;
    const insertSignupResult = await signupRepository.insert(signUp);

    const findResult = await signupRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    const findAllByIndividualIdResult = await signupRepository.findAllByIndividualId(insertIndividualResult.rows[0].id);
    const findAllByEventIdResult = await signupRepository.findAllByEventId(insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
    expect(findAllByIndividualIdResult.rows).toMatchObject([signUp]);
    expect(findAllByEventIdResult.rows).toMatchObject([signUp]);
});

test('updating works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.eventId = insertEventResult.rows[0].id;
    signUp.individualId = insertIndividualResult.rows[0].id;
    const insertSignupResult = await signupRepository.insert(signUp);

    signUp.confirmed = !signUp.confirmed;
    const updateSignupResult = await signupRepository.update(signUp);

    const findResult = await signupRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
});
test('inserting and finding users signed up to an event works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.addressId = insertAddressResult.rows[0].id;
    event.userId = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.eventId = insertEventResult.rows[0].id;
    signUp.individualId = insertIndividualResult.rows[0].id;
    const insertSignupResult = await signupRepository.insert(signUp);

    const findResult = await signupRepository.findUsersSignedUp(insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
});
