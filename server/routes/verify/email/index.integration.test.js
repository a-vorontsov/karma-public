const verify = require("./");
const request = require("supertest");
const app = require("../../../app");
const verifyModule = require("../../../modules/verification/email");

jest.mock("../../../modules/verification/email");

afterEach(() => {
    jest.clearAllMocks();
});

test("a server error during email verification returns false as expected", async () => {
    process.env.NO_AUTH=1;
    verifyModule.verifyEmail.mockImplementation(() => {
        throw new Error("Server error");
    });
    const response = await request(app)
        .post("/verify/email/")
        .set("authorization", "aValidToken")
        .send({data: {email: "email@email.com"}});
    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server error");

    process.env.NO_AUTH=0;
});
