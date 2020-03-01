const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const owasp = require("owasp-password-strength-test");
const regRepo = require("../../models/registrationRepository");

const registration = testHelpers.registration4;

jest.mock("owasp-password-strength-test");

beforeEach(async done => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    await testHelpers.clearDatabase();
    registerUserRequest.confirmPassword = "new_plaintext";
    done();
});

afterEach(async done => {
    jest.clearAllMocks();
    await testHelpers.clearDatabase();
    done();
});

const registerUserRequest = {
    password: "new_plaintext",
    confirmPassword: "new_plaintext",
    email: "test4@gmail.com",
    username: "userNamesArePointless",
};

test("user registration works", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: true});

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User registration successful. Goto individual/org registration selection");
    expect(response.body.userId).toBeGreaterThan(-1);
});

test("weak password fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: false});

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});

test("weak password fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: false});

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});

test("confirm password mismatch rejected", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: true});
    registerUserRequest.confirmPassword = "mistyped";

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Passwords do not match.");
});
