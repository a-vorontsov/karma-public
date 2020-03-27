const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const userRepo = require("../../../repositories/user");
const regRepo = require("../../../repositories/registration");
const orgRepo = require("../../../repositories/organisation");
const indivRepo = require("../../../repositories/individual");
const addressRepo = require("../../../repositories/address");
const userAgent = require("../../../modules/user");
const profileRepo = require("../../../repositories/profile");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();
const individual = testHelpers.getIndividual();
const organisation = testHelpers.getOrganisation();
const address = testHelpers.getAddress2();
const profile = testHelpers.getProfile();

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
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
            bio: "Test",
            womenOnly: true,
            firstName: "Paul",
            lastName: "change",
            gender: "f",
        },
    },
};

test("editing individual profile works", async () => {
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    individual.userId = userId;
    individual.addressId = addressId;
    individual.gender = "f";
    const indivResult = await indivRepo.insert(individual);

    profile.individualId = indivResult.rows[0].id;
    await profileRepo.insert(profile);
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
    const updatedProfileRes = await profileRepo.findByIndividualId(updatedIndiv.id);
    const updatedProfile = await updatedProfileRes.rows[0];

    expect(updatedUser.username).toBe(profileChangeRequest.data.user.username);
    expect(updatedIndiv.phone).toBe(profileChangeRequest.data.individual.phoneNumber);
    expect(updatedProfile.bio).toBe(profileChangeRequest.data.individual.bio);
    expect(updatedProfile.womenOnly).toBe(profileChangeRequest.data.individual.womenOnly);
    expect(updatedIndiv.firstname).toBe(individual.firstname);
});

test("attempting to set women only filter as a non-female is rejected as expected", async () => {
    const profileChangeRequest3 = {
        userId: 123,
        authToken: "abc",
        data: {
            user: {
                username: "newUserName",
            },
            individual: {
                phoneNumber: "newPhoneNumber",
                bio: "Test",
                womenOnly: true,
                firstName: "Paul",
                lastName: "change",
                gender: "f",
            },
        },
    };
    profileChangeRequest3.data.individual.gender = "m";
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    individual.userId = userId;
    individual.addressId = addressId;
    individual.gender = "f";
    const indivResult = await indivRepo.insert(individual);

    profile.individualId = indivResult.rows[0].id;
    await profileRepo.insert(profile);
    profileChangeRequest3.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest3);

    expect(response.body.message).toBe("Only women can filter by women only events.");
    expect(response.statusCode).toBe(400);
});

test("attempting to only change username works", async () => {
    const profileChangeRequest3 = {
        userId: 123,
        authToken: "abc",
        data: {
            user: {
                username: "newUserName",
            },
            individual: {
            // empty
            },
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    individual.userId = userId;
    individual.addressId = addressId;
    individual.gender = "f";
    const indivResult = await indivRepo.insert(individual);

    profile.individualId = indivResult.rows[0].id;
    await profileRepo.insert(profile);
    profileChangeRequest3.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest3);

    expect(response.body.message).toBe("Operation successful. Please GET the view profile endpoint to see the updated profile record.");
    expect(response.statusCode).toBe(200);
});

const profileChangeRequest2 = {
    userId: 123,
    authToken: "abc",
    data: {
        organisation: {
            phoneNumber: "newLandlineNo.",
            name: "change",
            organisationNumber: "change",
            organisationType: "change",
            pocFirstName: "change",
            pocLastName: "change",
            lowIncome: true,
            exempt: true,
            address: {
                addressLine1: "newAddressLine1",
                addressLine2: "newAddressLine2",
                townCity: "newTown",
                countryState: "newState",
                postCode: "1234EF",
            },
        },
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
    const updatedAddrRes = await addressRepo.findById(updatedOrgRes.rows[0].addressId);
    const updatedUser = updatedUserRes.rows[0];
    const updatedOrg = updatedOrgRes.rows[0];
    const updatedAddr = updatedAddrRes.rows[0];

    expect(updatedUser.username).toBe(user.username);
    expect(updatedOrg.phone).toBe(profileChangeRequest2.data.organisation.phoneNumber);
    expect(updatedOrg.addressId).toBe(organisation.addressId + 1);
    expect(updatedAddr.address1).toBe(profileChangeRequest2.data.organisation.address.addressLine1);
});

test("editing organisation profile works", async () => {
    const profileChangeRequest5 = {
        userId: 123,
        authToken: "abc",
        data: {
            organisation: {
            },
        },
    };

    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    organisation.userId = userId;
    organisation.addressId = addressId;
    const orgResult = await orgRepo.insert(organisation);

    profileChangeRequest5.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest5);

    expect(response.body.message).toBe("Operation successful. Please GET the view profile endpoint to see the updated profile record.");
    expect(response.statusCode).toBe(200);

    // get records after update

    const updatedUserRes = await userRepo.findById(userId);
    const updatedOrgRes = await orgRepo.findByUserID(userId);
    const updatedAddrRes = await addressRepo.findById(updatedOrgRes.rows[0].addressId);
    const updatedUser = updatedUserRes.rows[0];
    const updatedOrg = updatedOrgRes.rows[0];
    const updatedAddr = updatedAddrRes.rows[0];
});

test("invalid editing of organisation profile returns error as expected", async () => {
    const profileChangeRequest7 = {
        userId: 123,
        authToken: "abc",
        data: {
            organisation: {
                phoneNumber: "newLandlineNo.",
                name: "change",
                organisationNumber: "change",
                organisationType: "change",
                pocFirstName: "change",
                pocLastName: "change",
                lowIncome: true,
                exempt: true,
                address: {

                },
            },
        },
    };

    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    organisation.userId = userId;
    organisation.addressId = addressId;
    const orgResult = await orgRepo.insert(organisation);

    profileChangeRequest7.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest7);

    expect(response.body.message).toBe("Cannot read property 'rows' of undefined");
    expect(response.statusCode).toBe(500);
});

test("attempting to only change username with no individual or organisation object sent works", async () => {
    const profileChangeRequest3 = {
        userId: 123,
        authToken: "abc",
        data: {
            user: {
                username: "newUserName",
            },
        // empty
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    individual.userId = userId;
    individual.addressId = addressId;
    individual.gender = "f";
    const indivResult = await indivRepo.insert(individual);

    profile.individualId = indivResult.rows[0].id;
    await profileRepo.insert(profile);
    profileChangeRequest3.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest3);

    expect(response.body.message).toBe("Operation successful. Please GET the view profile endpoint to see the updated profile record.");
    expect(response.statusCode).toBe(200);
});

test("editing an individual profile's address works", async () => {
    const profileChangeRequest3 = {
        userId: 123,
        authToken: "abc",
        data: {
            user: {
                username: "newUserName",
            },
            individual: {
                phoneNumber: "newPhoneNumber",
                bio: "Test",
                womenOnly: true,
                firstName: "Paul",
                lastName: "change",
                gender: "f",
                address: {
                    addressLine1: "newLine1",
                },
            },
        },
    };
    await regRepo.insert(registration);
    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressId = await userAgent.registerAddress(address);

    individual.userId = userId;
    individual.addressId = addressId;
    individual.gender = "f";
    const indivResult = await indivRepo.insert(individual);

    profile.individualId = indivResult.rows[0].id;
    await profileRepo.insert(profile);
    profileChangeRequest3.userId = userId;

    const response = await request(app)
        .post("/profile/edit")
        .send(profileChangeRequest3);

    expect(response.body.message).toBe("Operation successful. Please GET the view profile endpoint to see the updated profile record.");
    expect(response.statusCode).toBe(200);
});
