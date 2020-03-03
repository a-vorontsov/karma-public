const userRepository = require("../models/userRepository");
const individualRepository = require("../models/individualRepository");
const addressRepository = require("../models/addressRepository");
const testHelpers = require("../test/testHelpers");
const util = require("../util/util");
const registrationRepository = require("../models/registrationRepository");

const registration = testHelpers.registration;
const user = testHelpers.user;
const address = testHelpers.address;
const individual = testHelpers.individual;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    individual.address_id = -1;
    individual.user_id = -1;
    return testHelpers.clearDatabase();
});

test('individuals and organisations correctly identified', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const isIndividual = await util.isIndividual(individual.user_id);
    const isOrganisation = await util.isOrganisation(individual.user_id);
    expect(isOrganisation).toBe(false);
    expect(isIndividual).toBe(true);
});
