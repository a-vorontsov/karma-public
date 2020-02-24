const userRepository = require("./userRepository");
const testHelpers = require("../test/testHelpers");
const registrationRepository = require("./registrationRepository");

const user = testHelpers.user;
const user2 = testHelpers.user2;
const registration = testHelpers.registration;
const registration2 = testHelpers.registration2;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    user2.email = "";
    return testHelpers.clearDatabase();

});

test('insert user and findById user work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const findUserResult = await userRepository.findById(insertUserResult.rows[0].id);
    expect(insertUserResult.rows[0]).toMatchObject(findUserResult.rows[0]);
});

test('find all users', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    const insertRegistrationResult2 = await registrationRepository.insert(registration2);

    user.email = insertRegistrationResult.rows[0].email;
    user2.email = insertRegistrationResult2.rows[0].email;

    const insertUserResult1 = await userRepository.insert(user);
    const insertUserResult2 = await userRepository.insert(user2);
    const findUserResult = await userRepository.findAll();
    expect(insertUserResult1.rows[0]).toMatchObject(findUserResult.rows[0]);
    expect(insertUserResult2.rows[0]).toMatchObject(findUserResult.rows[1]);
});
