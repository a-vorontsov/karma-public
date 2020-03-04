const userRepository = require("./userRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");
const authenticationRepository = require("./authenticationRepository");

const user = testHelpers.user;
const user2 = testHelpers.user2;
const registration = testHelpers.registration;
const registration2 = testHelpers.registration2;
const authentication = testHelpers.authentication;
const authentication2 = testHelpers.authentication2;


beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    authentication.user_id = -1;
    authentication2.user_id = -1;
    authentication.creation_date = "2016-06-22 19:10:25-07";
    authentication2.creation_date = "2018-06-22 19:10:25-07";
    user.email = "";
    user2.email = "";
    return testHelpers.clearDatabase();

});

test('insert authentication and findById authentication work', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    user.email = insertRegistrationResult.rows[0].email;
    const insertUserResult = await userRepository.insert(user);
    authentication.user_id = insertUserResult.rows[0].id;
    const insertAuthenticationResult = await authenticationRepository.insert(authentication);
    const findAuthenticationResult = await authenticationRepository.findById(insertAuthenticationResult.rows[0].id);
    expect(insertAuthenticationResult.rows[0]).toMatchObject(findAuthenticationResult.rows[0]);
});

test('find all authentications', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);
    const insertRegistrationResult2 = await registrationRepository.insert(registration2);

    user.email = insertRegistrationResult.rows[0].email;
    user2.email = insertRegistrationResult2.rows[0].email;

    const insertUserResult1 = await userRepository.insert(user);
    const insertUserResult2 = await userRepository.insert(user2);

    authentication.user_id = insertUserResult1.rows[0].id;
    authentication2.user_id = insertUserResult2.rows[0].id;
    const insertAuthenticationResult1 = await authenticationRepository.insert(authentication);
    const insertAuthenticationResult2 = await authenticationRepository.insert(authentication2);
    const findAuthenticationResult = await authenticationRepository.findAll();
    expect(insertAuthenticationResult1.rows[0]).toMatchObject(findAuthenticationResult.rows[0]);
    expect(insertAuthenticationResult2.rows[0]).toMatchObject(findAuthenticationResult.rows[1]);
});

test('find most recent auth token', async () => {
    const insertRegistrationResult = await registrationRepository.insert(registration);

    user.email = insertRegistrationResult.rows[0].email;

    const insertUserResult1 = await userRepository.insert(user);
    const currentUserID = insertUserResult1.rows[0].id;
    authentication.user_id = currentUserID;
    authentication2.user_id = currentUserID;
    authentication.creation_date = "2016-06-22 19:10:25-07";
    authentication2.creation_date = "2018-06-22 19:10:25-07";
    await authenticationRepository.insert(authentication);
    const insertAuthenticationResult2 = await authenticationRepository.insert(authentication2);
    const findLatestAuthenticationResult = await authenticationRepository.findLatestByUserID(currentUserID);
    expect(findLatestAuthenticationResult.rows[0]).toMatchObject(insertAuthenticationResult2.rows[0]);
    expect(findLatestAuthenticationResult.rowCount).toBe(1);
});
