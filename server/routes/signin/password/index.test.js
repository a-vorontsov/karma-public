const signin = require("./");
const request = require("supertest");
const app = require("../../../app");
const userAgent = require("../../../modules/user");

jest.mock("../../../modules/user");

afterEach(() => {
    jest.clearAllMocks();
});

test("signing in with valid credentials works", async () => {
    process.env.NO_AUTH=1;
    userAgent.signIn.mockResolvedValue({status: 200, message: "yay"});
    const response = await request(app)
        .post("/signin/password")
        .set("authorization", "aValidToken")
        .send({
            data: {
                email: "email@email.com",
                password: "mypass",
            },
        });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("yay");

    process.env.NO_AUTH=0;
});

test("signing in with a server error returns false as expected", async () => {
    process.env.NO_AUTH=1;
    userAgent.signIn.mockImplementation(() => {
        throw new Error("Server error");
    });
    const response = await request(app)
        .post("/signin/password")
        .set("authorization", "aValidToken")
        .send({
            data: {
                email: "email@email.com",
                password: "mypass",
            },
        });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Server error");

    process.env.NO_AUTH=0;
});
