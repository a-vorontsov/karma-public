const verify = require("./");
const request = require("supertest");
const app = require("../../../app");
const verifyModule = require("../../../modules/verification/twilio");

jest.mock("../../../modules/verification/twilio");

afterEach(() => {
    jest.clearAllMocks();
});

test("creating an phone verification record works", async () => {
    process.env.NO_AUTH=1;
    verifyModule.startPhoneVerification.mockResolvedValue(true);
    const response = await request(app)
        .post("/verify/phone/create")
        .set("authorization", "aValidToken")
        .send({});
    expect(response.body).toBe(true);

    process.env.NO_AUTH=0;
});

test("creating an ID verification record with an invalid id fails as expected", async () => {
    process.env.NO_AUTH=1;
    verifyModule.startPhoneVerification.mockImplementation(() => {
        throw new Error("Creation failed");
    });
    const response = await request(app)
        .post("/verify/phone/create")
        .set("authorization", "anInvalidToken")
        .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Creation failed");

    process.env.NO_AUTH=0;
});

test("checking a phone verification record works", async () => {
    process.env.NO_AUTH=1;
    verifyModule.checkPhoneVerification.mockResolvedValue(true);
    const response = await request(app)
        .post("/verify/phone/check")
        .set("authorization", null)
        .send({});
    expect(response.body).toBe(true);

    process.env.NO_AUTH=0;
});

test("updating an ID verification record with an invalid id fails as expected", async () => {
    process.env.NO_AUTH=1;
    verifyModule.checkPhoneVerification.mockImplementation(() => {
        throw new Error("Update failed");
    });
    const response = await request(app)
        .post("/verify/phone/check")
        .set("authorization", "anInvalidToken")
        .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Update failed");

    process.env.NO_AUTH=0;
});
