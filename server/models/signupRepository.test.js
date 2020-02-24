const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../test/testHelpers");
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
    individual.address_id = -1;
    individual.user_id = -1;
    user.email = "";
    event.address_id = -1;
    event.user_id = -1;
    signUp.event_id = -1;
    signUp.individual_id = -1;
    return testHelpers.clearDatabase();
});

test('inserting and finding works', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.address_id =  insertAddressResult.rows[0].id;
    event.user_id = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.event_id = insertEventResult.rows[0].id;
    signUp.individual_id = insertIndividualResult.rows[0].id;
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
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    event.address_id =  insertAddressResult.rows[0].id;
    event.user_id = insertUserResult.rows[0].id;
    const insertEventResult = await eventRepository.insert(event);

    signUp.event_id = insertEventResult.rows[0].id;
    signUp.individual_id = insertIndividualResult.rows[0].id;
    const insertSignupResult = await signupRepository.insert(signUp);

    signUp.confirmed = !signUp.confirmed;
    const updateSignupResult = await signupRepository.update(signUp);

    const findResult = await signupRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(signUp);
});