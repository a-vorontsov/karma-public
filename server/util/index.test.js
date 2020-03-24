const userRepository = require("../models/databaseRepositories/userRepository");
const individualRepository = require("../models/databaseRepositories/individualRepository");
const addressRepository = require("../models/databaseRepositories/addressRepository");
const testHelpers = require("../test/testHelpers");
const util = require("../util");
const registrationRepository = require("../models/databaseRepositories/registrationRepository");

let registrationExample1, userExample1, address, individual;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    individual = testHelpers.getIndividual();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('individuals and organisations correctly identified', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const isIndividual = await util.isIndividual(individual.userId);
    const isOrganisation = await util.isOrganisation(individual.userId);
    expect(isOrganisation).toBe(false);
    expect(isIndividual).toBe(true);
});
