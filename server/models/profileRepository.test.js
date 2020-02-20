const db = require("../database/connection");
const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const profileRepository = require("./profileRepository");
const testHelpers = require("../test/testHelpers");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert profile and findById profile work', async () => {
    const user = testHelpers.user;
    const insertUserResult = await userRepository.insert(user);

    const address = testHelpers.address;
    const insertAddressResult = await addressRepository.insert(address);

    const individual = testHelpers.individual;
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);

    const profile = testHelpers.profile;
    profile.individual_id = insertIndividualResult.rows[0].id;

    const insertProfileResult = await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findById(insertProfileResult.rows[0].id);
    expect(insertProfileResult.rows[0]).toMatchObject(findProfileResult.rows[0]);
});