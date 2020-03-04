const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const userRepo = require("../../models/databaseRepositories/userRepository");

const registration4 = testHelpers.registration4;
const registration5 = testHelpers.registration5;
const registration6 = testHelpers.registration6;
const user4 = testHelpers.user4;

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const signInEmailRequest = {
    email: "test4@gmail.com",
};

test("sign-in with email works", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, go to email verification screen.",
    );
});

test("sign-in with unverified email works", async () => {
    await regRepo.insert(registration4);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email exists but unverified. Goto email verification screen.",
    );
});

test("sign-in with verified email works", async () => {
    await regRepo.insert(registration5);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email verified, but no user account. Goto user registration screen.",
    );
});

test("sign-in with verified email but no registration works", async () => {
    await regRepo.insert(registration6);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(
        "Email verified, but no user account. Goto user registration screen.",
    );
});

test("sign-in with partial registration works", async () => {
    await regRepo.insert(registration5);
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
    await regRepo.insert(registration6);
    await userRepo.insert(user4);

    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Fully registered. Goto login screen.");
});
