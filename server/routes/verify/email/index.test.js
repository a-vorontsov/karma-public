const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");
const userRepo = require("../../../models/databaseRepositories/userRepository");

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

const verifyEmailRequest = {
    userId: null,
    authToken: null,
    data: {
        email: "test4@gmail.com",
        token: "tbd",
    }
};

test("email verification works", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(200);

    const regResult = await regRepo.findByEmail(signInEmailRequest.data.email);
    regRecord = regResult.rows[0];
    const token = regRecord.verificationToken;

    verifyEmailRequest.data.token = token;

    const verifyResponse = await request(app)
        .post("/verify/email")
        .send(verifyEmailRequest);

    expect(verifyResponse.body.message).toBe("Email successfully verified. Go to registration screen.");
    expect(verifyResponse.statusCode).toBe(200);
});

test("invalid token is rejected", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(200);

    const regResult = await regRepo.findByEmail(signInEmailRequest.data.email);
    regRecord = regResult.rows[0];
    const token = "invalidToken";

    verifyEmailRequest.data.token = token;

    const verifyResponse = await request(app)
        .post("/verify/email")
        .send(verifyEmailRequest);

    expect(verifyResponse.body.message).toBe("Invalid token");
    expect(verifyResponse.statusCode).toBe(400);
});

test("request without email address is rejected", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(200);

    const regResult = await regRepo.findByEmail(signInEmailRequest.data.email);
    regRecord = regResult.rows[0];

    const verifyResponse = await request(app)
        .post("/verify/email")
        .send({
            userId: null,
            authToken: null,
            data: {
                token: "tbd",
            }});

    expect(verifyResponse.body.message).toBe("No token found, or user/email does not exist.");
    expect(verifyResponse.statusCode).toBe(400);
});

test("request without token is rejected", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(200);

    const regResult = await regRepo.findByEmail(signInEmailRequest.data.email);
    regRecord = regResult.rows[0];

    const verifyResponse = await request(app)
        .post("/verify/email")
        .send({
            userId: null,
            authToken: null,
            data: {
                email: "test4@gmail.com",
            }
        });

    expect(verifyResponse.body.message).toBe("Invalid token");
    expect(verifyResponse.statusCode).toBe(400);
});

test("email verification works", async () => {
    const response = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(response.body.message).toBe(
        "Email did not exist. Email successfully recorded, wait for user to input email verification code.",
    );
    expect(response.statusCode).toBe(200);

    const regResult = await regRepo.findByEmail(signInEmailRequest.data.email);
    regRecord = regResult.rows[0];
    const token = regRecord.verificationToken;

    verifyEmailRequest.data.token = token;


    // re-requesting token

    const secondResponse = await request(app)
        .post("/signin/email")
        .send(signInEmailRequest);

    expect(secondResponse.body.message).toBe(
        "Email exists but unverified. The user has been sent a new verification token. Go to email verification screen.",
    );
    expect(secondResponse.statusCode).toBe(200);

    const regResult2 = await regRepo.findByEmail(signInEmailRequest.data.email);
    regRecord2 = regResult2.rows[0];
    const token2 = regRecord2.verificationToken;

    // sending first - old token instead of new
    const verifyResponse2 = await request(app)
        .post("/verify/email")
        .send(verifyEmailRequest);

    expect(verifyResponse2.body.message).toBe("Invalid token");
    expect(verifyResponse2.statusCode).toBe(400);

    // sending new token
    verifyEmailRequest.data.token = token2;

    const verifyResponse3 = await request(app)
        .post("/verify/email")
        .send(verifyEmailRequest);

    expect(verifyResponse3.body.message).toBe("Email successfully verified. Go to registration screen.");
    expect(verifyResponse3.statusCode).toBe(200);
});