const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const userRepo = require("../../../models/databaseRepositories/userRepository");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");

let user, registration;

beforeEach(() => {
    user = testHelpers.getUserExample4();
    registration = testHelpers.getRegistrationExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const registerIndividualRequest = {
    userId: 666,
    data: {
        individual: {
            title: "Mr.",
            firstName: "Paul",
            lastName: "Muller",
            dateOfBirth: "1998-10-09",
            gender: "M",
            phoneNumber: "+435958934",
            address: {
                addressLine1: "abc str",
                addressLine2: "nop",
                townCity: "London",
                countryState: "UK",
                postCode: "NW1 6XE",
            },
        }
    }
};

test("individual registration works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    registerIndividualRequest.userId = insertUserResult.rows[0].id;

    const response = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Individual registration successful.");
});


test("individual reg with wrong userId fails", async () => {
    registerIndividualRequest.userId = 99999;

    const response = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User with given ID does not exist");
});

test("duplicate individual reg fails", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    registerIndividualRequest.userId = insertUserResult.rows[0].id;

    const response = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Individual registration successful.");

    const duplicateResponse = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.body.message).toBe("Invalid operation: already fully registered.");
});
