const userRepository = require("./userRepository");
const resetRepository = require("./resetRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");

const user = testHelpers.user;
const registration = testHelpers.registration;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    return testHelpers.clearDatabase();

});

test('insert token and find token work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const userId = insertUserResult.rows[0].id;
    const insertTokenResult = await resetRepository.insertResetToken(userId, "333333");
    const findTokenResult = await resetRepository.findResetToken(userId);
    expect(insertTokenResult.rows[0]).toMatchObject(findTokenResult.rows[0]);
});
