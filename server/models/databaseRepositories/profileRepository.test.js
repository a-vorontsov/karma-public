const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const profileRepository = require("./profileRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");

let registration, user, individual, profile, address;

beforeEach(() => {
    registration = testHelpers.getRegistrationExample1();
    user = testHelpers.getUserExample1();
    individual = testHelpers.getIndividual();
    profile = testHelpers.getProfile();
    address = testHelpers.getAddress();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert profile and findById profile work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    profile.individualId = insertIndividualResult.rows[0].id;
    const insertProfileResult = await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findById(insertProfileResult.rows[0].id);
    expect(insertProfileResult.rows[0]).toMatchObject(findProfileResult.rows[0]);
});