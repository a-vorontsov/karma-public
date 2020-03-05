const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");
const eventRepository = require("./eventRepository");
const favouriteRepository = require("./favouriteRepository");

const registration = testHelpers.registration;
const user = testHelpers.user;
const address = testHelpers.address;
const individual = testHelpers.individual;
const event = testHelpers.event;
const favourite = testHelpers.favourite;

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
    favourite.event_id = -1;
    favourite.individual_id = -1;
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

    favourite.event_id = insertEventResult.rows[0].id;
    favourite.individual_id = insertIndividualResult.rows[0].id;
    await favouriteRepository.insert(favourite);

    const findResult = await favouriteRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    const findAllByIndividualIdResult = await favouriteRepository.findAllByIndividualId(insertIndividualResult.rows[0].id);
    const findAllByEventIdResult = await favouriteRepository.findAllByEventId(insertEventResult.rows[0].id);
    expect(findResult.rows[0]).toMatchObject(favourite);
    expect(findAllByIndividualIdResult.rows).toMatchObject([favourite]);
    expect(findAllByEventIdResult.rows).toMatchObject([favourite]);
});

test('deleting works', async () => {
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

    favourite.event_id = insertEventResult.rows[0].id;
    favourite.individual_id = insertIndividualResult.rows[0].id;
    await favouriteRepository.insert(favourite);

    const deleteResult = await favouriteRepository.remove(favourite);

    const findResult = await favouriteRepository.find(insertIndividualResult.rows[0].id, insertEventResult.rows[0].id);
    expect(deleteResult.rows[0]).toMatchObject(favourite);
    expect(findResult.rowCount).toBe(0);
});