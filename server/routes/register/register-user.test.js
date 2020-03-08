const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const owasp = require("owasp-password-strength-test");
const regRepo = require("../../models/databaseRepositories/registrationRepository");

let registration;

jest.mock("owasp-password-strength-test");

beforeEach(() => {
    registration = testHelpers.getRegistrationExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    registerUserRequest.confirmPassword = "new_plaintext";
    registerUserRequest.email = "test4@gmail.com";
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
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
    registerUserRequest.email = "invalid@email.com";

    const response = await request(app)
        .post("/register/user")
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});
