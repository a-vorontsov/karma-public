const db = require("../../database/connection");
const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");

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

test('insert individual and findById individual work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registration);
    user.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findById(insertIndividualResult.rows[0].id);
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});