const authAgent = require("./auth-agent");
const testHelpers = require("../../test/testHelpers");
const userRepo = require("../../models/databaseRepositories/userRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");
const indivRepo = require("../../models/databaseRepositories/individualRepository");
const addressRepo = require("../../models/databaseRepositories/addressRepository");
const authRepo = require("../../models/databaseRepositories/authenticationRepository");
const request = require("supertest");
process.env.ENABLE_TEST_ROUTES = 1;
const app = require("../../app");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample4();

beforeEach(() => {
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 0;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});


test("log-in works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const authToken = await authAgent.logIn(userId);
    const authResult = await authRepo.findLatestByUserID(userId);
    expect(authToken).toBe(authResult.rows[0].token);
});

test("inserting multiple tokens works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    // first call
    const authToken1 = await authAgent.logIn(userId);
    const authResult = await authRepo.findLatestByUserID(userId);
    expect(authToken1).toBe(authResult.rows[0].token);
    // second call
    const authResult2 = await authRepo.findLatestByUserID(userId);
    expect(authToken1).toBe(authResult2.rows[0].token);
});

test("isValidToken works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const isValidResult = await authAgent.isValidToken(userId, "abc");
    expect(isValidResult.isValidToken).toBe(false);
    expect(isValidResult.error).toBe("No token found, or user/email does not exist.");
    // insertion
    const authToken = await authAgent.logIn(userId);
    const authResult = await authRepo.findLatestByUserID(userId);
    expect(authToken).toBe(authResult.rows[0].token);

    const isValidResult2 = await authAgent.isValidToken(userId, "abc");
    expect(isValidResult2.isValidToken).toBe(false);
    expect(isValidResult2.error).toBe("Invalid token");

    const isValidResult3 = await authAgent.isValidToken(userId, authToken);
    expect(isValidResult3.isValidToken).toBe(true);
    expect(isValidResult3.error).toBe(null);

    await authAgent.logOut(userId);

    const isValidResult4 = await authAgent.isValidToken(userId, authToken);
    expect(isValidResult4.isValidToken).toBe(false);
    expect(isValidResult4.error).toBe("Expired token");
});

// -- integration tests -- //

const anyRequest0 = {
    noUserId: "nope",
};

test("missing userId works", async () => {
    const response = await request(app)
        .get("/any/route")
        .send(anyRequest0)
        .redirects(1);

    expect(response.body.message).toBe("No userId specified in incoming request.");
    expect(response.statusCode).toBe(400);

    const responseOfPost = await request(app)
        .post("/any/route/that/requires/auth")
        .send(anyRequest0)
        .redirects(1);

    expect(responseOfPost.body.message).toBe(
        "No userId specified in incoming request.",
    );
    expect(responseOfPost.statusCode).toBe(400);
});

const anyRequest1 = {
    userId: 123,
    noAuthToken: "unspecified",
};

test("missing authToken works", async () => {
    const response = await request(app)
        .get("/any/route")
        .send(anyRequest1)
        .redirects(1);

    expect(response.body.message).toBe(
        "No authToken specified in incoming request.",
    );
    expect(response.statusCode).toBe(400);

    const responseOfPost = await request(app)
        .post("/any/route/that/requires/auth")
        .send(anyRequest1)
        .redirects(1);

    expect(responseOfPost.body.message).toBe(
        "No authToken specified in incoming request.",
    );
    expect(responseOfPost.statusCode).toBe(400);
});

const anyRequest2 = {
    userId: null,
    authToken: "specified",
};

test("null userId works", async () => {
    const response = await request(app)
        .get("/any/route")
        .send(anyRequest2)
        .redirects(1);

    expect(response.body.message).toBe("Request is not authorised.");
    expect(response.statusCode).toBe(401);

    const responseOfPost = await request(app)
        .post("/any/route/that/requires/auth")
        .send(anyRequest2)
        .redirects(1);

    expect(responseOfPost.body.message).toBe("Request is not authorised.");
    expect(responseOfPost.statusCode).toBe(401);
});

const anyRequest3 = {
    userId: 123,
    authToken: null,
};

test("null authToken works", async () => {
    const response = await request(app)
        .get("/any/route")
        .send(anyRequest3)
        .redirects(1);

    expect(response.body.message).toBe("Request is not authorised.");
    expect(response.statusCode).toBe(401);

    const responseOfPost = await request(app)
        .post("/any/route/that/requires/auth")
        .send(anyRequest3)
        .redirects(1);

    expect(responseOfPost.body.message).toBe("Request is not authorised.");
    expect(responseOfPost.statusCode).toBe(401);
});

const anyRequest4 = {
    userId: 999999999,
    authToken: "abc",
};

test("non-existent user detected", async () => {
    const response = await request(app)
        .get("/any/route")
        .send(anyRequest4)
        .redirects(1);

    expect(response.body.message).toBe("No token found, or user/email does not exist.");
    expect(response.statusCode).toBe(401);

    const responseOfPost = await request(app)
        .post("/any/route/that/requires/auth")
        .send(anyRequest4)
        .redirects(1);

    expect(responseOfPost.body.message).toBe("No token found, or user/email does not exist.");
    expect(responseOfPost.statusCode).toBe(401);
});

const anyRequest5 = {
    userId: 999999999,
    authToken: "nonMatchingToken",
};

test("non-matching token working", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const validToken = await authAgent.logIn(userId);
    const verifyValidToken = await authAgent.isValidToken(userId, validToken);
    expect(verifyValidToken.isValidToken).toBe(true);

    anyRequest5.userId = userId;
    const response = await request(app)
        .get("/any/route")
        .send(anyRequest5)
        .redirects(1);

    expect(response.body.message).toBe(
        "Invalid token",
    );
    expect(response.statusCode).toBe(401);

    const responseOfPost = await request(app)
        .post("/profile/edit/password")
        .send(anyRequest5)
        .redirects(1);

    expect(responseOfPost.body.message).toBe(
        "Invalid token",
    );
    expect(responseOfPost.statusCode).toBe(401);
});

const anyRequest6 = {
    userId: 999999999,
    authToken: "matchingToken",
    newPassword: "newPass",
    confirmPassword: "mistypedNewPass",
};

const logInReq = {
    userId: null,
    authToken: null,
    data: {
        email: "email",
        password: "password",
    }
};

const owasp = require("owasp-password-strength-test");
jest.mock("owasp-password-strength-test");

test("valid and expired token working", async () => {
    owasp.test.mockReturnValue({strong: true});

    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    const insertAddressResult = await addressRepo.insert(testHelpers.getAddress());
    const addressId = insertAddressResult.rows[0].id;
    const insertIndiv = testHelpers.getIndividual();
    insertIndiv.userId = userId;
    insertIndiv.addressId = addressId;
    const insertIndividualResult = await indivRepo.insert(insertIndiv);

    logInReq.data.email = user.email;
    const logInResponse = await request(app)
        .post("/signin/password")
        .send(logInReq)
        .redirects(0);

    const validToken = logInResponse.body.authToken;
    const verifyValidToken = await authAgent.isValidToken(userId, validToken);
    expect(verifyValidToken.isValidToken).toBe(true);

    anyRequest6.userId = userId;
    anyRequest6.authToken = validToken;
    const response = await request(app)
        .get("/test/reqauth")
        .send(anyRequest6)
        .redirects(0);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Successfully authenticated and had correct permissions to access route.");


    const responseOfPost = await request(app)
        .post("/profile/edit/password")
        .send(anyRequest6)
        .redirects(0);

    expect(responseOfPost.body.message).toBe("Passwords do not match.");
    expect(responseOfPost.statusCode).toBe(400);

    authAgent.logOut(userId);

    // second pair of requests

    const response2 = await request(app)
        .get("/profile")
        .send(anyRequest6)
        .redirects(1);

    expect(response2.body.message).toBe("Expired token");
    expect(response2.statusCode).toBe(401);

    const responseOfPost2 = await request(app)
        .post("/profile/edit/password")
        .send(anyRequest6)
        .redirects(1);

    expect(responseOfPost2.body.message).toBe("Expired token");
    expect(responseOfPost2.statusCode).toBe(401);
});
