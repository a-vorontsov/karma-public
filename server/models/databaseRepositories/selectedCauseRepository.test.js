const testHelpers = require("../../test/testHelpers");
const selectedCauseRepository = require("./selectedCauseRepository");
const causeRepository = require("./causeRepository");
const userRepository = require("./userRepository");
const registrationRepository = require("./registrationRepository");


const registration = testHelpers.registration3;
const cause = testHelpers.cause;
const user = testHelpers.user3;

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
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(userId, causeId);
    expect(insertResult.rows[0]).toMatchObject({
        userId: userId,
        causeId: causeId
    });
});
test('find works', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    const insertCauseResult = await causeRepository.insert(cause)
    const userId = insertUserResult.rows[0].id;
    const causeId = insertCauseResult.rows[0].id;
    const insertResult = await selectedCauseRepository.insert(userId, causeId);
    const findResult = await selectedCauseRepository.find(userId, causeId);
    const findByCauseIdResult = await selectedCauseRepository.findByCauseId(causeId);
    const findByUserIdResult = await selectedCauseRepository.findByUserId(userId);
    expect(findResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByCauseIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
    expect(findByUserIdResult.rows[0]).toMatchObject(insertResult.rows[0]);
});
