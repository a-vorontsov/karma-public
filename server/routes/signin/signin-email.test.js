const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const userRepo = require("../../models/databaseRepositories/userRepository");

let registrationExample4, registrationExample5, registrationExample6, user4;
beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample4();
    registrationExample2 = testHelpers.getRegistrationExample5();
    registrationExample6 = testHelpers.getRegistrationExample6();
    user4 = testHelpers.getUserExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 0;
    process.env.SKIP_MAIL_SENDING_FOR_TESTING = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const signInEmailRequest = {
    userId: null,
    authToken: null,
    data: {
        email: "test4@gmail.com",
    }
};

test("sign-in with email works", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(400);
});

test("sign-in with unverified email works", async () => {
    await regRepo.insert(registrationExample1);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email exists but unverified. Goto email verification screen.",
    );
    expect(response.statusCode).toBe(400);
});

test("sign-in with verified email works", async () => {
    await regRepo.insert(registrationExample2);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email verified, but no user account. Goto user registration screen.",
    );
});

test("sign-in with verified email but no registration works", async () => {
    await regRepo.insert(registrationExample6);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email verified, but no user account. Goto user registration screen.",
    );
});

test("sign-in with partial registration works", async () => {
    await regRepo.insert(registrationExample2);
    await userRepo.insert(user4);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "User account registered, but no indiv/org profile. Aks for password and then goto indiv/org selection screen.",
    );
});

test("sign-in with full registration works", async () => {
    await regRepo.insert(registrationExample6);
    await userRepo.insert(user4);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Fully registered. Goto login screen.");
});
