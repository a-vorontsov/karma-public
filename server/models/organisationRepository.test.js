const db = require("../database/connection");
const userRepository = require("./userRepository");
const organisationRepository = require("./organisationRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../test/testHelpers");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert organisation and findById organisation work', async () => {
    const user = testHelpers.user;
    const insertUserResult = await userRepository.insert(user);

    const address = testHelpers.address;
    const insertAddressResult = await addressRepository.insert(address);

    const organisation = testHelpers.organisation;
    organisation.address_id = insertAddressResult.rows[0].id;
    organisation.user_id = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findById(insertOrganisationResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});