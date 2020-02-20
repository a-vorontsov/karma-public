const db = require("../database/connection");
const userRepository = require("./userRepository");
const organisationRepository = require("./organisationRepository");
const addressRepository = require("./addressRepository");
const testHelpers = require("../test/testHelpers");
const registrationRepository = require("./registrationRepository");

const registration = testHelpers.registration;
const user = testHelpers.user;
const address = testHelpers.address;
const organisation = testHelpers.organisation;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    organisation.address_id = -1;
    organisation.user_id = -1;
    return testHelpers.clearDatabase();
});

test('insert organisation and findById organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.address_id = insertAddressResult.rows[0].id;
    organisation.user_id = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findById(insertOrganisationResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});