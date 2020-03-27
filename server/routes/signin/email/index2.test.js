const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const regRepo = require("../../../repositories/registration");
const userRepo = require("../../../repositories/user");
const regStatus = require("../../../util/registration");
const userService = require("../../../modules/user");

jest.mock("../../../util/registration");
jest.mock("../../../modules/user");

afterEach(() => {
    jest.clearAllMocks();
});

test("signing up email in case of a DB error returns error message as expected", async () => {
    process.env.NO_AUTH=1;
    regStatus.emailExists.mockResolvedValue(false);
    userService.registerEmail.mockImplementation(() => {
      throw new Error("DB error");
    });
    const response = await request(app)
        .post("/signin/email")
        .set("authorization", "")
        .send({
            data: {
                email: "email@email.com",
            }
        });

    expect(response.body.message).toBe("Email did not exist. Error in recording user's email in database. Please see error message: DB error");
    expect(response.status).toBe(500);

    process.env.NO_AUTH=0;
});

test("signing up email in case of a logical server error returns error message as expected", async () => {
    process.env.NO_AUTH=1;
    regStatus.emailExists.mockResolvedValue(true);
    regStatus.isEmailVerified.mockResolvedValue(true);
    regStatus.userAccountExists.mockResolvedValue(true);
    regStatus.isPartlyRegistered.mockResolvedValue(false);
    regStatus.isFullyRegisteredByEmail.mockResolvedValue(false);
    const response = await request(app)
        .post("/signin/email")
        .set("authorization", "")
        .send({
            data: {
                email: "email@email.com",
            }
        });

    expect(response.body.message).toBe("Logical or internal system error. Please debug the registration and user objects.");
    expect(response.status).toBe(500);

    process.env.NO_AUTH=0;
});

test("signing up email in case of a technical server error returns error message as expected", async () => {
    process.env.NO_AUTH=1;
    regStatus.emailExists.mockResolvedValue(true);
    regStatus.isEmailVerified.mockResolvedValue(true);
    regStatus.userAccountExists.mockImplementation(() => {
      throw new Error("Server error");
    });
    regStatus.isPartlyRegistered.mockResolvedValue(false);
    regStatus.isFullyRegisteredByEmail.mockResolvedValue(false);
    const response = await request(app)
        .post("/signin/email")
        .set("authorization", "")
        .send({
            data: {
                email: "email@email.com",
            }
        });

    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);

    process.env.NO_AUTH=0;
});