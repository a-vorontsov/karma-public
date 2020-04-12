const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const userRepo = require("../../../repositories/user");
const regRepo = require("../../../repositories/registration");
const causeRepo = require("../../../repositories/cause");
const authService = require("../../../modules/authentication");
const selectedCauseRepo = require("../../../repositories/cause/selected");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();
const cause = testHelpers.getCauseExample1();

beforeEach(() => {
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
        },
    },
};

const profileViewRequest = {
    userId: 99999999999999999,
};

test("getting causes for current user works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;
    registerIndividualRequest.userId = userId;

    const response = await request(app)
        .post("/signup/individual")
        .send(registerIndividualRequest);

    expect(response.body.message).toBe("Individual registration successful.");
    expect(response.statusCode).toBe(200);

    const causeResult = await causeRepo.insert(cause);
    await selectedCauseRepo.insert(userId, causeResult.rows[0].id);
    const authToken = authService.logInUser(userId);

    process.env.NO_AUTH = 0;
    const profileResponse = await request(app)
        .get(`/profile/causes`)
        .set("authorization", authToken);

    expect(profileResponse.body.data[0].userId).toBe(userId);
    expect(profileResponse.body.data[0].causeId).toBe(causeResult.rows[0].id);
    expect(profileResponse.body.data[0].name).toBe(causeResult.rows[0].name);
    expect(profileResponse.body.data[0].title).toBe(causeResult.rows[0].title);
    expect(profileResponse.body.data[0].description).toBe(causeResult.rows[0].description);
    expect(profileResponse.body.message).toBe(
        "Causes for current user fetched successfully.",
    );
    expect(profileResponse.statusCode).toBe(200);
});
