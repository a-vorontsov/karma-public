const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const userRepo = require("../../models/databaseRepositories/userRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");

let user, registration;

beforeEach(() => {
    user = testHelpers.getUserExample4();
    registration = testHelpers.getRegistrationExample4();
    process.env.SKIP_PASSWORD_CHECKS = 0;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const ogranisationRegistrationRequest = {
    userId: 420,
    organisationNumber: "69",
    name: "Karma org",
    addressLine1: "Karma str",
    addressLine2: "n",
    organisationType: "c",
    lowIncome: "no",
    exempt: "no",
    pocFirstName: "Paul",
    pocLastName: "Muller",
    townCity: "London",
    countryState: "UK",
    postCode: "WC 23",
    phoneNumber: "+44343525",
};

test("ogranisation registration works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    ogranisationRegistrationRequest.userId = insertUserResult.rows[0].id;

    const response = await request(app)
        .post("/register/organisation")
        .send(ogranisationRegistrationRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Organisation registration successful.");
});

test("individual reg with wrong userId fails", async () => {
    ogranisationRegistrationRequest.userId = 99999;

    const response = await request(app)
        .post("/register/organisation")
        .send(ogranisationRegistrationRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User with given ID does not exist");
});

test("duplicate ogranisation registration fails", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    ogranisationRegistrationRequest.userId = insertUserResult.rows[0].id;

    const response = await request(app)
        .post("/register/organisation")
        .send(ogranisationRegistrationRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Organisation registration successful.");

    const duplicateResponse = await request(app)
        .post("/register/organisation")
        .send(ogranisationRegistrationRequest);

    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.body.message).toBe("Invalid operation: already fully registered.");
});
