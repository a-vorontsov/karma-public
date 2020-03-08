const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const owasp = require("owasp-password-strength-test");
const regRepo = require("../../models/databaseRepositories/registrationRepository");

const registration = testHelpers.registration4;

jest.mock("owasp-password-strength-test");

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 0;
    registerUserRequest.data.user.confirmPassword = "new_plaintext";
    registerUserRequest.data.user.email = "test4@gmail.com";
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const registerUserRequest = {
    userId: null,
    authToken: null,
    data: {
        user: {
            password: "new_plaintext",
            confirmPassword: "new_plaintext",
            email: "test4@gmail.com",
            username: "userNamesArePointless",
        }
    }
};

test("user registration works", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: true});

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("User registration successful. Goto individual/org registration selection");
    expect(response.statusCode).toBe(200);
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

test("duplicate user registration fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: true});

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User registration successful. Goto individual/org registration selection");
    expect(response.body.userId).toBeGreaterThan(-1);

    const duplicateResponse = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(2);
    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.body.message).toBe("Invalid operation: user record already exists.");
});

test("invalid email fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: false});
    registerUserRequest.data.user.email = "invalid@email.com";

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});
