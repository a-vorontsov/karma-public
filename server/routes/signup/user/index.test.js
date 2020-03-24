const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const owasp = require("owasp-password-strength-test");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");
const jose = require("../../../modules/jose");

let registration;

jest.mock("owasp-password-strength-test");

beforeEach(() => {
    registration = testHelpers.getRegistrationExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    registerUserRequest.data.user.confirmPassword = "new_plaintext";
    registerUserRequest.data.user.email = "test4@gmail.com";
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const registerUserRequest = {
    data: {
        user: {
            password: "new_plaintext",
            confirmPassword: "new_plaintext",
            email: "test4@gmail.com",
            username: "userNamesArePointless",
        }
    },
    pub: jose.getEncPubAsPEM(),
};

test("user registration works", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: true});

    const response = await request(app)
        .post("/signup/user")
        .set("authorization", null)
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("User registration successful. Go to individual/org registration selection");
    expect(response.statusCode).toBe(200);
});

test("weak password fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: false});

    const response = await request(app)
        .post("/signup/user")
        .set("authorization", null)
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});

test("weak password fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: false});

    const response = await request(app)
        .post("/signup/user")
        .set("authorization", null)
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});

test("duplicate user registration fails", async () => {
    await regRepo.insert(registration);
    owasp.test.mockReturnValue({strong: true});

    const response = await request(app)
        .post("/signup/user")
        .set("authorization", null)
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("User registration successful. Go to individual/org registration selection");

    const duplicateResponse = await request(app)
        .post("/signup/user")
        .set("authorization", null)
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
        .post("/signup/user")
        .set("authorization", null)
        .send(registerUserRequest);

    expect(owasp.test).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Weak password.");
});
