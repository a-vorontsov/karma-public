const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const regRepo = require("../../../repositories/registration");
const userRepo = require("../../../repositories/user");

let registrationExample4; let registrationExample5; let registrationExample6; let user4;
beforeEach(() => {
    registrationExample4 = testHelpers.getRegistrationExample4();
    registrationExample5 = testHelpers.getRegistrationExample5();
    registrationExample6 = testHelpers.getRegistrationExample6();
    user4 = testHelpers.getUserExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_MAIL_SENDING_FOR_TESTING = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const signInEmailRequest = {
    data: {
        email: "test4@gmail.com",
    },
};

test("sign-in with email works", async () => {
    const response = await request(app)
        .post("/signin/email")
        .set("authorization", null)
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(200);
});

test("sign-in with unverified email works", async () => {
    await regRepo.insert(registrationExample4);

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", null)
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email exists but unverified. The user has been sent a new verification token. Go to email verification screen.",
    );
    expect(response.statusCode).toBe(200);
});

test("sign-in with verified email works", async () => {
    await regRepo.insert(registrationExample5);

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", null)
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
        "Email verified, but no user account. Go to user registration screen.",
    );
});

test("sign-in with verified email but no registration works", async () => {
    await regRepo.insert(registrationExample6);

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", null)
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
        "Email verified, but no user account. Go to user registration screen.",
    );
});

test("sign-in with partial registration works", async () => {
    await regRepo.insert(registrationExample5);
    await userRepo.insert(user4);

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", null)
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
        "User account registered, but no indiv/org profile. Ask for password and then go to indiv/org selection screen.",
    );
});

test("sign-in with full registration works", async () => {
    await regRepo.insert(registrationExample6);
    await userRepo.insert(user4);

    const response = await request(app)
        .post("/signin/email")
        .set("authorization", null)
        .send(signInEmailRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Fully registered. Go to login screen.");
});
