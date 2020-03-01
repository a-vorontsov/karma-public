const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const userRepo = require("../../models/userRepository");
const regRepo = require("../../models/registrationRepository");

const user = testHelpers.user4;
const registration = testHelpers.registration4;

beforeEach(async done => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    await testHelpers.clearDatabase();
    done();
});

afterEach(async done => {
    jest.clearAllMocks();
    await testHelpers.clearDatabase();
    done();
});

const registerIndividualRequest = {
    userId: 666,
    title: "Mr.",
    firstName: "Paul",
    middleNames: "",
    surName: "Muller",
    dateOfBirth: "1998-10-09",
    gender: "M",
    phoneNumber: "+435958934",
    addressLine1: "abc str",
    addressLine2: "nop",
    townCity: "London",
    countryState: "UK",
    postCode: "NW1 6XE",
};

test("individual registration works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    registerIndividualRequest.userId = insertUserResult.rows[0].id;

    const response = await request(app)
        .post("/register/individual")
        .send(registerIndividualRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Individual registration successful.");
});


test("individual reg with wrong userId fails", async () => {
    registerIndividualRequest.userId = 99999;

    const response = await request(app)
        .post("/register/individual")
        .send(registerIndividualRequest);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("User with given ID does not exist");
});

test("duplicate individual reg fails", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    registerIndividualRequest.userId = insertUserResult.rows[0].id;

    const response = await request(app)
        .post("/register/individual")
        .send(registerIndividualRequest);

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Individual registration successful.");

    const duplicateResponse = await request(app)
        .post("/register/individual")
        .send(registerIndividualRequest);

    expect(duplicateResponse.statusCode).toBe(400);
    expect(duplicateResponse.body.message).toBe("Invalid operation: already fully registered.");
});
