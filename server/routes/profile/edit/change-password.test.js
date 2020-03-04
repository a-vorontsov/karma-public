const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/testHelpers");
const owasp = require("owasp-password-strength-test");
const userRepo = require("../../../models/databaseRepositories/userRepository");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");

const user = testHelpers.user4;
const registration = testHelpers.registration4;

jest.mock("owasp-password-strength-test");

const changePasswordRequest = {
    userId: 1,
    oldPassword: "password",
    newPassword: "new_plaintext",
    confirmPassword: "new_plaintext",
};

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    changePasswordRequest.oldPassword = "password";
    changePasswordRequest.confirmPassword = "new_plaintext";
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test('changing password works', async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);

    changePasswordRequest.userId = insertUserResult.rows[0].id;

    owasp.test.mockReturnValue({strong: true});
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Password successfully updated.");
});


test('weak passwords rejected', async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);

    changePasswordRequest.userId = insertUserResult.rows[0].id;

    owasp.test.mockReturnValue({strong: false});
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});

test("confirm password mismatch rejected", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);

    changePasswordRequest.userId = insertUserResult.rows[0].id;
    changePasswordRequest.confirmPassword = "new_plaintext_mistyped";

    owasp.test.mockReturnValue({strong: false});
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Passwords do not match.");
});

test("incorrect old pass rejected", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);

    changePasswordRequest.userId = insertUserResult.rows[0].id;
    changePasswordRequest.oldPassword = "incorrect_old_pass";

    owasp.test.mockReturnValue({strong: true});
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Incorrect old password.");
});

