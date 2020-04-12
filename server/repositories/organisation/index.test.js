const userRepository = require("../user");
const organisationRepository = require("./");
const addressRepository = require("../address");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let registration, user, address, organisation;

beforeEach(() => {
    registration = testHelpers.getRegistrationExample1();
    user = testHelpers.getUserExample1();
    address = testHelpers.getAddress();
    organisation = testHelpers.getOrganisation();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert organisation and findById organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findById(insertOrganisationResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});

test('insert organisation and findByUserId organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findByUserID(insertUserResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});

test('insert organisation and removeByUserId organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findByUserID(insertUserResult.rows[0].id);
    const deleteResult = await organisationRepository.removeByUserId(insertUserResult.rows[0].id);
    const findAfterDelete = await organisationRepository.removeByUserId(insertUserResult.rows[0].id);
    expect(findOrganisationResult.rows[0]).toMatchObject(deleteResult.rows[0]);
    expect(findAfterDelete.rowCount).toBe(0);
});

test('insert organisation and removeByUserId organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findByUserID(insertUserResult.rows[0].id);
    organisation.id = findOrganisationResult.rows[0].id;
    organisation.orgName = "This is a new org";
    const updateResult = await organisationRepository.update(organisation);
    const findAfterUpdate = await organisationRepository.removeByUserId(insertUserResult.rows[0].id);
    expect(insertResult.rows[0].orgName).not.toBe(updateResult.rows[0].orgName);
    expect(findAfterUpdate.rows[0].orgName).toBe(organisation.orgName);
});

test('insert organisation and findAll organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.findAll(insertUserResult.rows[0].id);
    expect(insertOrganisationResult.rows[0]).toMatchObject(findOrganisationResult.rows[0]);
});

test('insert organisation and findAll organisation work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    organisation.addressId = insertAddressResult.rows[0].id;
    organisation.userId = insertUserResult.rows[0].id;
    const insertOrganisationResult = await organisationRepository.insert(organisation);
    const findOrganisationResult = await organisationRepository.getOrganisationLocation(insertUserResult.rows[0].id);
    expect(findOrganisationResult.rows[0].lat).toBe(insertAddressResult.rows[0].lat);
    expect(findOrganisationResult.rows[0].long).toBe(insertAddressResult.rows[0].long);
    expect(findOrganisationResult.rows[0].organisationId).toBe(insertOrganisationResult.rows[0].id);
});
