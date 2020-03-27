const reset = require("./");
const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const regRepo = require("../../../repositories/registration");
const userRepo = require("../../../repositories/user");
const userAgent = require("../../../modules/user");
const user = testHelpers.getUserExample4();
const profile = testHelpers.getProfile();
const registration = testHelpers.getRegistrationExample4();

jest.mock("../../../modules/user");

afterEach(() => {
    jest.clearAllMocks();
});

test("a server error during email verification returns false as expected", async () => {
    process.env.NO_AUTH=1;
    process.env.SKIP_PASSWORD_CHECKS=1;
    const resetRequest = {
        data: {
            password: "newpass",
        },
    };
    userAgent.updatePassword.mockImplementation(() => {
      throw new Error("Server error");
    });
    const response = await request(app)
        .post("/reset/")
        .set("authorization", "aValidToken")
        .send(resetRequest);
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error");

    process.env.NO_AUTH=0;
    process.env.SKIP_PASSWORD_CHECKS=0;
});