const request = require('supertest');
const app = require("../../../../app");
const testHelpers = require("../../../../test/helpers");
const owasp = require("owasp-password-strength-test");
const userRepo = require("../../../../repositories/user");
const regRepo = require("../../../../repositories/registration");
const userAgent = require("../../../../modules/user");

jest.mock("owasp-password-strength-test");
jest.mock("../../../../modules/user");
let user; let registration;
const changePasswordRequest = {
    userId: 1,
    oldPassword: "password",
    newPassword: "new_plaintext",
    confirmPassword: "new_plaintext",
};

beforeEach(() => {
    user = testHelpers.getUserExample4();
    registration = testHelpers.getRegistrationExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
    changePasswordRequest.oldPassword = "password";
    changePasswordRequest.confirmPassword = "new_plaintext";
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test('changing password in case of a server error returns error message as expected', async () => {
    owasp.test.mockReturnValue({strong: true});
    userAgent.isCorrectPasswordById.mockImplementation(() => {
        throw new Error("Server error");
    });
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
});

