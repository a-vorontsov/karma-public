const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const userRepo = require("../../models/databaseRepositories/userRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");

const user = testHelpers.user4;
const registration = testHelpers.registration5;
const address = testHelpers.address;
const individual = testHelpers.individual;
const org = testHelpers.organisation;

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
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

const profileViewRequest = {
    userId: 666,
};

test("viewing individual profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    registerIndividualRequest.userId = userId;

    const response = await request(app)
        .post("/register/individual")
        .send(registerIndividualRequest);

    expect(response.body.message).toBe("Individual registration successful.");
    expect(response.statusCode).toBe(200);

    profileViewRequest.userId = userId;
    const profileResponse = await request(app)
        .get("/profile/view")
        .send(profileViewRequest);

    expect(profileResponse.body.message).toBe(
        "Found individual profile for user.",
    );
    expect(profileResponse.body.postCode).toBe(registerIndividualRequest.postCode);
    expect(profileResponse.body.firstName).toBe(
        registerIndividualRequest.firstName,
    );
    expect(profileResponse.body.surName).toBe(
        registerIndividualRequest.surName,
    );
    expect(profileResponse.body.dateOfBirth).toBe(
        Date(registerIndividualRequest.dateOfBirth),
    );
    expect(profileResponse.body.gender).toBe(registerIndividualRequest.gender);
    expect(profileResponse.body.phoneNumber).toBe(
        registerIndividualRequest.phoneNumber,
    );
    expect(profileResponse.body.addressLine1).toBe(
        registerIndividualRequest.addressLine1,
    );
    expect(profileResponse.body.username).toBe(user.username);
    expect(profileResponse.body.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
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

test("viewing org profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    ogranisationRegistrationRequest.userId = userId;

    const response = await request(app)
        .post("/register/organisation")
        .send(ogranisationRegistrationRequest);

    expect(response.body.message).toBe("Organisation registration successful.");
    expect(response.statusCode).toBe(200);

    profileViewRequest.userId = userId;
    const profileResponse = await request(app)
        .get("/profile/view")
        .send(profileViewRequest);

    expect(profileResponse.body.message).toBe(
        "Found organisation profile for user.",
    );
    expect(profileResponse.body.postCode).toBe(
        ogranisationRegistrationRequest.postCode,
    );
    expect(profileResponse.body.organisationNumber).toBe(
      ogranisationRegistrationRequest.organisationNumber
    );
    expect(profileResponse.body.username).toBe(user.username);
    expect(profileResponse.body.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
});
