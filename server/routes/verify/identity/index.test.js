const verify = require("./");
const request = require("supertest");
const app = require("../../../app");
const verifyModule = require("../../../modules/verification/stripe");

jest.mock("../../../modules/verification/stripe");

afterEach(() => {
    jest.clearAllMocks();
});

test("creating an ID verification record works", async () => {
    process.env.NO_AUTH=1;
    verifyModule.uploadFile.mockResolvedValue(true);
    const response = await request(app)
        .post("/verify/identity/create")
        .set("authorization", "aValidToken")
        .send({});
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Document uploaded for verification.");

    process.env.NO_AUTH=0;
});

test("creating an ID verification record with an invalid id fails as expected", async () => {
    process.env.NO_AUTH=1;
    verifyModule.uploadFile.mockImplementation(() => {
        throw new Error("Creation failed");
    });
    const response = await request(app)
        .post("/verify/identity/create")
        .set("authorization", "anInvalidToken")
        .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Creation failed");

    process.env.NO_AUTH=0;
});

test("updating an ID verification record works", async () => {
    process.env.NO_AUTH=1;
    verifyModule.updateAccount.mockResolvedValue(true);
    const response = await request(app)
        .get("/verify/identity/check")
        .set("authorization", null)
        .send({});
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Identity verified for user.");

    process.env.NO_AUTH=0;
});

test("updating an ID verification record with an invalid id fails as expected", async () => {
    process.env.NO_AUTH=1;
    verifyModule.updateAccount.mockImplementation(() => {
        throw new Error("Update failed");
    });
    const response = await request(app)
        .get("/verify/identity/check")
        .set("authorization", "anInvalidToken")
        .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Update failed");

    process.env.NO_AUTH=0;
});
