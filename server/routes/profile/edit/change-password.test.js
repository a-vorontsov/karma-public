const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/testHelpers");
const owasp = require("owasp-password-strength-test");

jest.mock("owasp-password-strength-test");

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
});

afterEach(() => {
    jest.clearAllMocks();
});

const changePasswordRequest = {
    userId: 1,
    oldPassword: "old_plaintext",
    newPassword: "new_plaintext",
    confirmPassword: "new_plaintext",
};


test('changing password works', async () => {
    owasp.test.mockReturnValue({strong: true});
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);
    
    expect(response.statusCode).toBe(200);
});


test('weak passwords rejected', async () => {
    owasp.test.mockReturnValue({strong: false});
    const response = await request(app)
        .post("/profile/edit/password")
        .send(changePasswordRequest);
    expect(owasp.test).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(400);
});
