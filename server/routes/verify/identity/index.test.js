const verify = require("./");
const request = require("supertest");
const app = require("../../../app");
const verifyModule = require("../../../modules/verification/stripe");

jest.mock("../../../modules/verification/stripe");

beforeEach(() => {
    process.env.NO_AUTH=1;
});

afterEach(() => {
    process.env.NO_AUTH=0;
    jest.clearAllMocks();
});

test("creating an ID verification record works", async () => {
    verifyModule.uploadFile.mockResolvedValue(true);
    const response = await request(app)
        .post("/verify/identity/create")
        .set("authorization", "aValidToken")
        .send({});
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Document uploaded for verification.");
});

test("creating an ID verification record with an invalid id fails as expected", async () => {
    verifyModule.uploadFile.mockImplementation(() => {
        throw new Error("Creation failed");
    });
    const response = await request(app)
        .post("/verify/identity/create")
        .set("authorization", "anInvalidToken")
        .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Creation failed");
});

test("updating an ID verification record works", async () => {
    verifyModule.updateAccount.mockResolvedValue(true);
    const response = await request(app)
        .get("/verify/identity/check")
        .set("authorization", null)
        .send({});
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Identity verified for user.");
});

test("updating an ID verification record with an invalid id fails as expected", async () => {
    verifyModule.updateAccount.mockImplementation(() => {
        throw new Error("Update failed");
    });
    const response = await request(app)
        .get("/verify/identity/check")
        .set("authorization", "anInvalidToken")
        .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Update failed");
});
