const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const userRepo = require("../../../models/databaseRepositories/userRepository");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();

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
            }
        }
    }
};

const profileViewRequest = {
    userId: 99999999999999999,
};

test("viewing individual profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    registerIndividualRequest.userId = userId;

    const response = await request(app)
        .post("/signup/individual")
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
    expect(profileResponse.body.data.individual.address.postCode).toBe(registerIndividualRequest.data.individual.address.postCode);
    expect(profileResponse.body.data.individual.firstName).toBe(
        registerIndividualRequest.data.individual.firstName,
    );
    expect(profileResponse.body.data.individual.lastName).toBe(
        registerIndividualRequest.data.individual.lastName,
    );
    expect(Date(profileResponse.body.data.individual.dateOfBirth)).toBe(
        Date(registerIndividualRequest.data.individual.dateOfBirth)
    );
    expect(profileResponse.body.data.individual.gender).toBe(registerIndividualRequest.data.individual.gender);
    expect(profileResponse.body.data.individual.phoneNumber).toBe(
        registerIndividualRequest.data.individual.phoneNumber,
    );
    expect(profileResponse.body.data.individual.address.addressLine1).toBe(
        registerIndividualRequest.data.individual.address.addressLine1,
    );
    expect(profileResponse.body.data.user.username).toBe(user.username);
    expect(profileResponse.body.data.user.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
});

const ogranisationRegistrationRequest = {
    userId: 420,
    data: {
        organisation: {
            organisationNumber: "69",
            name: "Karma org",
            organisationType: "c",
            lowIncome: "no",
            exempt: "no",
            pocFirstName: "Paul",
            pocLastName: "Muller",
            address: {
                addressLine1: "Karma str",
                addressLine2: "n",
                townCity: "London",
                countryState: "UK",
                postCode: "WC 23",
            },
            phoneNumber: "+44343525",
        }
    }
};

test("viewing org profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    ogranisationRegistrationRequest.userId = userId;

    const response = await request(app)
        .post("/signup/organisation")
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
    expect(profileResponse.body.data.individual.address.postCode).toBe(
        ogranisationRegistrationRequest.data.organisation.address.postCode,
    );
    expect(profileResponse.body.data.individual.organisationNumber).toBe(
        ogranisationRegistrationRequest.data.organisation.organisationNumber,
    );
    expect(profileResponse.body.data.user.username).toBe(user.username);
    expect(profileResponse.body.data.user.email).toBe(registration.email);
    expect(profileResponse.statusCode).toBe(200);
});

test("viewing profile without user account works", async () => {
    const profileResponse = await request(app)
        .get("/profile/view")
        .send(profileViewRequest);

    expect(profileResponse.statusCode).toBe(400);
    expect(profileResponse.body.message).toBe(
        "Cannot read property 'username' of undefined",
    );
});

test("viewing profile without indiv or org account works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    profileViewRequest.userId = userId;
    const profileResponse = await request(app)
        .get("/profile/view")
        .send(profileViewRequest);

    expect(profileResponse.statusCode).toBe(400);
    expect(profileResponse.body.message).toBe(
        "Cannot read property 'addressId' of undefined",
    );
});
