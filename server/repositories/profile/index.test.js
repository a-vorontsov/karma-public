const userRepository = require("../user");
const individualRepository = require("../individual");
const addressRepository = require("../address");
const profileRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

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

test('insert profile and findByIndividualId profile work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    profile.individualId = insertIndividualResult.rows[0].id;
    const insertProfileResult = await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findByIndividualId(profile.individualId);
    expect(insertProfileResult.rows[0]).toMatchObject(findProfileResult.rows[0]);
});

test('insert profile and removeByIndividualId profile work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    profile.individualId = insertIndividualResult.rows[0].id;
    await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findByIndividualId(profile.individualId);
    const deleteResult = await profileRepository.removeByIndividualId(profile.individualId);
    const findAfterDeletion = await profileRepository.findByIndividualId(profile.individualId);
    expect(findProfileResult.rows[0]).toMatchObject(deleteResult.rows[0]);
    expect(findAfterDeletion.rowCount).toBe(0);
});

test('insert profile and findAll profile work', async () => {

    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertAddressResult = await addressRepository.insert(address);
    individual.addressId = insertAddressResult.rows[0].id;
    individual.userId = insertUserResult.rows[0].id;
    const insertIndividualResult = await individualRepository.insert(individual);
    profile.individualId = insertIndividualResult.rows[0].id;
    const insertProfileResult = await profileRepository.insert(profile);
    const findProfileResult = await profileRepository.findAll();
    expect(insertProfileResult.rows[0]).toMatchObject(findProfileResult.rows[0]);
});

test('update profile and findById profile work', async () => {
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
    profile.id = findProfileResult.rows[0].id;
    profile.bio = "new bio and stuff";
    const updateResult = await profileRepository.update(profile);
    const findProfileResultAfterUpdate = await profileRepository.findById(insertProfileResult.rows[0].id);
    expect(updateResult.rows[0]).toMatchObject(findProfileResultAfterUpdate.rows[0]);
    expect(findProfileResultAfterUpdate.rows[0]).not.toMatchObject(findProfileResult.rows[0]);
    const updateKarmaPointsResult = await profileRepository.updateKarmaPoints(profile.individualId);
    expect(insertProfileResult.rows[0].karmaPoints).toBe(updateKarmaPointsResult.rows[0].karmaPoints - 1);
});