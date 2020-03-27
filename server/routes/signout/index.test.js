const signout = require("./");
const request = require("supertest");
const app = require("../../app");
const authService = require("../../modules/authentication");

jest.mock("../../modules/authentication");

afterEach(() => {
    jest.clearAllMocks();
});


test("sign-out with valid token works", async () => {
    authService.requireAuthentication.mockImplementation((req, res, next) => {
      next();
    });
    authService.logOut.mockReturnValue(true);
    const response = await request(app)
        .post("/signout?userId=1")
        .set("authorization", "aValidToken")
        .send({});

    expect(authService.requireAuthentication).toHaveBeenCalledTimes(1);
    expect(authService.logOut).toHaveBeenCalledTimes(1);
    expect(authService.logOut).toHaveBeenCalledWith("aValidToken");
    expect(response.body.message).toBe("User successfully logged out.");
    expect(response.statusCode).toBe(200);
});

test("signing-out in case of a server error returns false as expected", async () => {
    authService.requireAuthentication.mockImplementation((req, res, next) => {
      next();
    });
    authService.logOut.mockImplementation(() => {
      throw new Error("Server error");
    });
    const response = await request(app)
        .post("/signout?userId=1")
        .set("authorization", "aValidToken")
        .send({});

    expect(authService.requireAuthentication).toHaveBeenCalledTimes(1);
    expect(authService.logOut).toHaveBeenCalledTimes(1);
    expect(authService.logOut).toHaveBeenCalledWith("aValidToken");
    expect(response.body.message).toBe("Server error");
    expect(response.statusCode).toBe(500);
});