const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const profileRepository = require("./profileRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");

const registration = testHelpers.registration;
const user = testHelpers.user;
const individual = testHelpers.individual;
const profile = testHelpers.profile;
const address = testHelpers.address;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    individual.id = -1;
    individual.user_id = -1;
    profile.individual_id = -1;
    return testHelpers.clearDatabase();
});

test('insert profile and findById profile work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    profile.individual_id = insertIndividualResult.rows[0].id;
    const insertProfileResult = await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findById(insertProfileResult.rows[0].id);
    expect(insertProfileResult.rows[0]).toMatchObject(findProfileResult.rows[0]);
});