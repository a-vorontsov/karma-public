const userRepository = require("../models/databaseRepositories/userRepository");
const individualRepository = require("../models/databaseRepositories/individualRepository");
const addressRepository = require("../models/databaseRepositories/addressRepository");
const testHelpers = require("../test/testHelpers");
const util = require("../util/util");
const registrationRepository = require("../models/databaseRepositories/registrationRepository");

const registration = testHelpers.registration;
const user = testHelpers.user;
const address = testHelpers.address;
const individual = testHelpers.individual;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    individual.addressId = -1;
    individual.userId = -1;
    return testHelpers.clearDatabase();
});

test('individuals and organisations correctly identified', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const isIndividual = await util.isIndividual(individual.userId);
    const isOrganisation = await util.isOrganisation(individual.userId);
    expect(isOrganisation).toBe(false);
    expect(isIndividual).toBe(true);
});
