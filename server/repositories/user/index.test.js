const userRepository = require("./");
const testHelpers = require("../../test/helpers");
const registrationRepository = require("../registration");

let userExample1, userExample2, registrationExample1, registrationExample2;

beforeEach(() => {
    userExample1 = testHelpers.getUserExample1();
    userExample2 = testHelpers.getUserExample2();
    registrationExample1 = testHelpers.getRegistrationExample1();
    registrationExample2 = testHelpers.getRegistrationExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();

});

test('insert user and findById user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const findUserResult = await userRepository.findById(insertUserResult.rows[0].id);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('insert user and findByEmail user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const findUserResult = await userRepository.findByEmail(insertUserResult.rows[0].email);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('insert user and removeUserById user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const findUserResult = await userRepository.findByEmail(insertUserResult.rows[0].email);
    const deletionResult = await userRepository.removeUserById(insertUserResult.rows[0].id);
    const findUserResultAfterDeletion = await userRepository.findByEmail(insertUserResult.rows[0].email);
    expect(findUserResult.rows[0]).toMatchObject(deletionResult.rows[0]);
    expect(findUserResultAfterDeletion.rowCount).toBe(0);
});

test('insert user and findIdByEmail user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const findIdResult = await userRepository.findIdFromEmail(insertUserResult.rows[0].email);
    expect(findIdResult.rows[0].id).toBe(insertUserResult.rows[0].id);
});

test('insert user and findByUsername user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    const findUserResult = await userRepository.findByUsername(insertUserResult.rows[0].username);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('insert user and updatePassword work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    await userRepository.findByUsername(insertUserResult.rows[0].username);
    const updatePassword = await userRepository.updatePassword(insertUserResult.rows[0].id, "123", "456");
    const findUserResultUpdate = await userRepository.findByUsername(insertUserResult.rows[0].username);
    expect(insertUserResult.rows[0].passwordHash).not.toBe(findUserResultUpdate.rows[0].passwordHash);
    expect(findUserResultUpdate.rows[0].password).toBe(updatePassword.rows[0].password);
});

test('insert user and updateVerificationStatus work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    userExample1.verified = false;
    const insertUserResult = await userRepository.insert(userExample1);
    await userRepository.findByUsername(insertUserResult.rows[0].username);
    const updatePassword = await userRepository.updateVerificationStatus(insertUserResult.rows[0].id, true);
    const findUserResultUpdate = await userRepository.findByUsername(insertUserResult.rows[0].username);
    expect(insertUserResult.rows[0].verified).not.toBe(findUserResultUpdate.rows[0].verified);
    expect(findUserResultUpdate.rows[0].verified).toBe(updatePassword.rows[0].verified);
});

test('insert user and updateUsername work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);
    await userRepository.findByEmail(insertUserResult.rows[0].email);
    const updatePassword = await userRepository.updateUsername(insertUserResult.rows[0].id, "crazy username");
    const findUserResultUpdate = await userRepository.findByEmail(insertUserResult.rows[0].email);
    expect(insertUserResult.rows[0].username).not.toBe(findUserResultUpdate.rows[0].username);
    expect(findUserResultUpdate.rows[0].username).toBe(updatePassword.rows[0].username);
});

test('find all users', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registrationExample1);
    const insertRegistrationResult2 = await registrationRepository.insert(registrationExample2);

    userExample1.email = insertRegistrationResult.rows[0].email;
    userExample2.email = insertRegistrationResult2.rows[0].email;

    const insertUserResult1 = await userRepository.insert(userExample1);
    const insertUserResult2 = await userRepository.insert(userExample2);
    const findUserResult = await userRepository.findAll();
    expect(insertUserResult1.rows[0]).toMatchObject(findUserResult.rows[0]);
    expect(insertUserResult2.rows[0]).toMatchObject(findUserResult.rows[1]);
});
