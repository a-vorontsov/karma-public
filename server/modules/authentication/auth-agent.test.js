const authAgent = require("./auth-agent");
const testHelpers = require("../../test/testHelpers");
const userRepo = require("../../models/databaseRepositories/userRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const authRepo = require("../../models/databaseRepositories/authenticationRepository");

const user = testHelpers.user4;
const registration = testHelpers.registration4;

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});


test("log-in works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = await authAgent.logIn(userId);
    const authResult = await authRepo.findLatestByUserID(userId);
    expect(authToken).toBe(authResult.rows[0].token);
});

test("inserting multiple tokens works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    // first call
    const authToken1 = await authAgent.logIn(userId);
    const authResult = await authRepo.findLatestByUserID(userId);
    expect(authToken1).toBe(authResult.rows[0].token);
    // second call
    const authResult2 = await authRepo.findLatestByUserID(userId);
    expect(authToken1).toBe(authResult2.rows[0].token);
});

test("isValidToken works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const isValidResult = await authAgent.isValidToken(userId, "abc");
    expect(isValidResult.isValidToken).toBe(false);
    expect(isValidResult.error).toBe("Token not found");
    // insertion
    const authToken = await authAgent.logIn(userId);
    const authResult = await authRepo.findLatestByUserID(userId);
    expect(authToken).toBe(authResult.rows[0].token);

    const isValidResult2 = await authAgent.isValidToken(userId, "abc");
    expect(isValidResult2.isValidToken).toBe(false);
    expect(isValidResult2.error).toBe("Invalid token");

    const isValidResult3 = await authAgent.isValidToken(userId, authToken);
    expect(isValidResult3.isValidToken).toBe(true);
    expect(isValidResult3.error).toBe(null);

    await authAgent.logOut(userId);

    const isValidResult4 = await authAgent.isValidToken(userId, authToken);
    expect(isValidResult4.isValidToken).toBe(false);
    expect(isValidResult4.error).toBe("Expired token");
});
