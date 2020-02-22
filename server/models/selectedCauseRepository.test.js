const testHelpers = require("../test/testHelpers");
const selectedCauseRepository = require("./selectedCauseRepository");
const causeRepository = require("./causeRepository");
const userRepository = require("./userRepository");
const registrationRepository = require("./registrationRepository");


const registration = testHelpers.registration;
const cause = testHelpers.cause;
const user = testHelpers.user;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    user.email = "";
    return testHelpers.clearDatabase();
});

test('insert works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertCauseResult = await causeRepository.insert(cause)
    const user_id = insertUserResult.rows[0].id;
    const cause_id = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(user_id, cause_id);
    expect(insertResult.rows[0]).toMatchObject({
        'user_id': user_id,
        'cause_id': cause_id
    });
});
test('find works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertCauseResult = await causeRepository.insert(cause)
    const user_id = insertUserResult.rows[0].id;
    const cause_id = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(user_id, cause_id);
    const findResult = await selectedCauseRepository.find(user_id, cause_id);
    const findByCauseIdResult = await selectedCauseRepository.findByCauseId(cause_id);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(user_id);
    expect(findResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByCauseIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByUserIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
});
