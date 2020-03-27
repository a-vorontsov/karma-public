const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const regRepo = require("../../../repositories/registration");
const userRepo = require("../../../repositories/user");
const userAgent = require("../../../modules/user");
const user = testHelpers.getUserExample4();
const profile = testHelpers.getProfile();
const registration = testHelpers.getRegistrationExample4();

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("resetting the password works", async () => {
    process.env.NO_AUTH = 1;
    const resetRequest = {
        data: {
            password: "newPass69!.",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    resetRequest.userId = userId;

    const response = await request(app)
        .post("/reset")
        .send(resetRequest)
        .redirects(0);

    expect(response.body.message).toBe("Password successfully updated. Go to sign-in screen.");
    expect(response.statusCode).toBe(200);
    expect(await userAgent.isCorrectPasswordById(userId, resetRequest.data.password)).toBe(true);
});

test("resetting the password with a weak pass is rejected as expected", async () => {
    process.env.NO_AUTH = 1;
    const resetRequest = {
        data: {
            password: "weakpass",
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    resetRequest.userId = userId;

    const response = await request(app)
        .post("/reset")
        .send(resetRequest)
        .redirects(0);

    expect(response.body.message).toBe("Weak password.");
    expect(response.statusCode).toBe(400);
});
