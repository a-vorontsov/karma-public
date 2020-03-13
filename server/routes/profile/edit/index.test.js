const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const userRepo = require("../../../models/databaseRepositories/userRepository");
const regRepo = require("../../../models/databaseRepositories/registrationRepository");
const orgRepo = require("../../../models/databaseRepositories/organisationRepository");
const indivRepo = require("../../../models/databaseRepositories/individualRepository");
const addressRepo = require("../../../models/databaseRepositories/addressRepository");
const userAgent = require("../../../modules/authentication/user-agent");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();
const individual = testHelpers.getIndividual();
const organisation = testHelpers.getOrganisation();
const address = testHelpers.getAddress2();

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const profileChangeRequest = {
    userId: 123,
    authToken: "abc",
    data: {
        user: {
            username: "newUserName",
        },
        individual: {
            phoneNumber: "newPhoneNumber",
        }
    },
};

test("editing individual profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    individual.userId = userId;
    individual.addressId = addressId;
    const indivResult = await indivRepo.insert(individual);

    profileChangeRequest.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest);

    expect(response.body.message).toBe("Operation successful. Please GET the view profile endpoint to see the updated profile record.");
    expect(response.statusCode).toBe(200);

    // get records after update

    const updatedUserRes = await userRepo.findById(userId);
    const updatedIndivRes = await indivRepo.findByUserID(userId);
    const updatedUser = updatedUserRes.rows[0];
    const updatedIndiv = updatedIndivRes.rows[0];

    expect(updatedUser.username).toBe(profileChangeRequest.data.user.username);
    expect(updatedIndiv.phone).toBe(profileChangeRequest.data.individual.phoneNumber);
    expect(updatedIndiv.firstname).toBe(individual.firstname);
});

const profileChangeRequest2 = {
    userId: 123,
    authToken: "abc",
    data: {
        organisation: {
            phoneNumber: "newLandlineNo.",
            address: {
                addressLine1: "newAddressLine1",
                postCode: "newPostCode",
            }
        }
    },
};

test("editing organisation profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    organisation.userId = userId;
    organisation.addressId = addressId;
    const orgResult = await orgRepo.insert(organisation);

    profileChangeRequest2.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest2);

    expect(response.body.message).toBe("Operation successful. Please GET the view profile endpoint to see the updated profile record.");
    expect(response.statusCode).toBe(200);

    // get records after update

    const updatedUserRes = await userRepo.findById(userId);
    const updatedOrgRes = await orgRepo.findByUserID(userId);
    const updatedAddrRes = await addressRepo.findById(addressId);
    const updatedUser = updatedUserRes.rows[0];
    const updatedOrg = updatedOrgRes.rows[0];
    const updatedAddr = updatedAddrRes.rows[0];

    expect(updatedUser.username).toBe(user.username);
    expect(updatedOrg.phone).toBe(profileChangeRequest2.data.organisation.phoneNumber);
    expect(updatedOrg.addressId).toBe(organisation.addressId);
    expect(updatedAddr.address1).toBe(profileChangeRequest2.data.organisation.address.addressLine1);
    expect(updatedAddr.postcode).toBe(profileChangeRequest2.data.organisation.address.postCode);
    expect(updatedAddr.address2).toBe(address.addressLine2);
});