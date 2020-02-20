const db = require("../database/connection");
const userRepository = require("./userRepository");
const individualRepository = require("./individualRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../test/testHelpers");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert individual and findById individual work', async () => {
    const user = testHelpers.user;
    const insertUserResult = await userRepository.insert(user);

    const address = testHelpers.address;
    const insertAddressResult = await addressRepository.insert(address);

    const individual = testHelpers.individual;
    individual.address_id = insertAddressResult.rows[0].id;
    individual.user_id = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    const findIndividualResult = await individualRepository.findById(insertIndividualResult.rows[0].id);
    expect(insertIndividualResult.rows[0]).toMatchObject(findIndividualResult.rows[0]);
});