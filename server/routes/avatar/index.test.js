const request = require("supertest");
const reqExt = require("superagent");
const app = require("../../app");
const path = require("path");
const log = require("../../util/log");

const testHelpers = require("../../test/helpers");
const userRepo = require("../../repositories/user");
const regRepo = require("../../repositories/registration");
const addressRepo = require("../../repositories/address");
const individualRepo = require("../../repositories/individual");
const organisationRepo = require("../../repositories/organisation");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();
const address= testHelpers.getAddress();
const individual = testHelpers.getIndividual();
const organisation = testHelpers.getOrganisation();
const skipS3 = process.env.SKIP_S3;
const bucketName = process.env.S3_BUCKET_NAME;

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
    process.env.SKIP_S3 = skipS3;
    process.env.S3_BUCKET_NAME = bucketName;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


// == Test working default images == //

test("fetching default individual avatar works", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    const insertIndividualResult = await individualRepo.insert(individual);
    const avatarResponse = await request(app)
        .get(`/avatar/individual?userId=${insertIndividualResult.rows[0].userId}`);

    expect(avatarResponse.statusCode).toBe(200);

    expect(avatarResponse.body.message).toBe(
        "Fetched image for user!",
    );
    expect(avatarResponse.body.pictureUrl).toContain(
        "/default/individual",
    );
});

test("fetching default organisation avatar works", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    organisation.addressId = addressResult.rows[0].id;
    organisation.userId = userId;

    const insertOrganisationResult = await organisationRepo.insert(organisation);
    const avatarResponse = await request(app)
        .get(`/avatar/organisation?userId=${insertOrganisationResult.rows[0].userId}`);

    expect(avatarResponse.statusCode).toBe(200);

    expect(avatarResponse.body.message).toBe(
        "Fetched image for user!",
    );
    expect(avatarResponse.body.pictureUrl).toContain(
        "/default/organisation",
    );
});

// == Test missing user ID fetching == //

test("fetching non-existent individual avatar results in error", async () => {
    const fakeId = 999;

    const avatarResponse = await request(app)
        .get(`/avatar/individual?userId=${fakeId}`);

    expect(avatarResponse.statusCode).toBe(404);

    expect(avatarResponse.body.message).toBe(
        `There is no individual with user ID ${fakeId}`,
    );

    expect(avatarResponse.body.pictureUrl).toBe(undefined);
});

test("fetching non-existent organisation avatar results in error", async () => {
    const fakeId = 999;

    const avatarResponse = await request(app)
        .get(`/avatar/organisation?userId=${fakeId}`);

    expect(avatarResponse.statusCode).toBe(404);

    expect(avatarResponse.body.message).toBe(
        `There is no organisation with user ID ${fakeId}`,
    );

    expect(avatarResponse.body.pictureUrl).toBe(undefined);
});

// == Test updating a profile picture == //

test("updating a profile picture for an authenticated individual works", async () => {
        await regRepo.insert(registration);

        const insertUserResult = await userRepo.insert(user);
        const userId = insertUserResult.rows[0].id;

        const addressResult = await addressRepo.insert(address);

        individual.addressId = addressResult.rows[0].id;
        individual.userId = userId;

        const insertIndividualResult = await individualRepo.insert(individual);

        const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

        const avatarResponse = await request(app)
            .post(`/avatar/upload/individual?userId=${insertIndividualResult.rows[0].userId}`)
            .attach('picture', individualTestImage);

        expect(avatarResponse.statusCode).toBe(200);

        expect(avatarResponse.body.message).toBe(
            `Avatar successfully updated for individual with ID ${userId}`,
        );

        expect(avatarResponse.body.pictureUrl).toContain(
            "amazonaws.com/avatar-individual",
        );

        if ( process.env.SKIP_S3 ) {
            log.log("Skipping S3 image download for testing (SKIP_S3)");
        } else {
            const pictureUrl = avatarResponse.body.pictureUrl;
            const pictureResponse = await reqExt.get(pictureUrl);

            expect(pictureResponse.statusCode).toBe(200);

            // validate successful type conversion / preservation
            expect(pictureResponse.type).toBe("png");
        }
});

test("updating a profile picture for an authenticated organisation works", async () => {
        await regRepo.insert(registration);

        const insertUserResult = await userRepo.insert(user);
        const userId = insertUserResult.rows[0].id;

        const addressResult = await addressRepo.insert(address);

        organisation.addressId = addressResult.rows[0].id;
        organisation.userId = userId;

        const insertOrganisationResult = await organisationRepo.insert(organisation);

        const organisationTestImage = path.join(__dirname, "../../modules/picture/resources/organisationTest.png");

        const avatarResponse = await request(app)
            .post(`/avatar/upload/organisation?userId=${insertOrganisationResult.rows[0].userId}`)
            .attach('picture', organisationTestImage);

        expect(avatarResponse.statusCode).toBe(200);

        expect(avatarResponse.body.message).toBe(
            `Avatar successfully updated for organisation with ID ${userId}`,
        );

        expect(avatarResponse.body.pictureUrl).toContain(
            "amazonaws.com/avatar-organisation",
        );

        if ( process.env.SKIP_S3 ) {
            log.log("Skipping S3 image download for testing (SKIP_S3)");
        } else {
            const pictureUrl = avatarResponse.body.pictureUrl;
            const pictureResponse = await reqExt.get(pictureUrl);

            expect(pictureResponse.statusCode).toBe(200);

            // validate successful type conversion / preservation
            expect(pictureResponse.type).toBe("png");
        }
});

test("updating a profile picture for an unauthenticated user fails", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    await individualRepo.insert(individual);
    const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/avatar/upload/individual`)
        .attach('picture', individualTestImage);

    expect(avatarResponse.statusCode).not.toBe(200);
});

test("uploading a profile picture for non-existent user fails", async () => {
    // SETUP & INSERTION
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    const insertIndividualResult = await individualRepo.insert(individual);

    const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const invalidId = insertIndividualResult.rows[0].userId + 10;

    const avatarResponse = await request(app)
        .post(`/avatar/upload/individual?userId=${invalidId}`)
        .attach('picture', individualTestImage);

    expect(avatarResponse.statusCode).toBe(404);

    expect(avatarResponse.body.message).toBe(
        `There is no individual with user ID ${invalidId}`,
    );
});

// == Test deleting a profile picture == //

test("deleting a profile picture for an authenticated individual works", async () => {
        // SETUP & INSERTION

        await regRepo.insert(registration);

        const insertUserResult = await userRepo.insert(user);
        const userId = insertUserResult.rows[0].id;

        const addressResult = await addressRepo.insert(address);

        individual.addressId = addressResult.rows[0].id;
        individual.userId = userId;

        const insertIndividualResult = await individualRepo.insert(individual);

        const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

        const avatarResponse = await request(app)
            .post(`/avatar/upload/individual?userId=${insertIndividualResult.rows[0].userId}`)
            .attach('picture', individualTestImage);

        expect(avatarResponse.statusCode).toBe(200);

        expect(avatarResponse.body.message).toBe(
            `Avatar successfully updated for individual with ID ${userId}`,
        );

        expect(avatarResponse.body.pictureUrl).toContain(
            "amazonaws.com/avatar-individual",
        );

        if ( process.env.SKIP_S3 ) {
            log.log("Skipping S3 image download for testing (SKIP_S3)");
        } else {
            const pictureUrl = avatarResponse.body.pictureUrl;
            const pictureResponse = await reqExt.get(pictureUrl);

            expect(pictureResponse.statusCode).toBe(200);

            // validate successful type conversion / preservation
            expect(pictureResponse.type).toBe("png");

            // DELETION

            const deletionResponse = await request(app)
                .post(`/avatar/delete/individual?userId=${insertIndividualResult.rows[0].userId}`);

            expect(deletionResponse.statusCode).toBe(200);
            expect(deletionResponse.body.message).toBe(`Successfully deleted image!`);
            expect(deletionResponse.body.oldLocation).toBe(`${pictureUrl}`);
        }
});

test("deleting without specifying user type fails", async () => {
    const deletionResponse = await request(app)
        .post(`/avatar/delete/FAKE?userId=10`);

    expect(deletionResponse.statusCode).toBe(400);
    expect(deletionResponse.body.message).toContain(
        `User type not specified, specify one of:`,
    );
});

test("deleting a profile picture for a user without one is handled", async () => {
    // SETUP & INSERTION

    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    const insertIndividualResult = await individualRepo.insert(individual);

    const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const deletionResponse = await request(app)
        .post(`/avatar/delete/individual?userId=${insertIndividualResult.rows[0].userId}`);

    expect(deletionResponse.statusCode).toBe(200);
    expect(deletionResponse.body.message).toBe(`The individual with user ID ${insertIndividualResult.rows[0].userId} has no image`);
});

test("deleting a profile picture for an authenticated fails for an invalid bucket", async () => {
    // SETUP & INSERTION

    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    const insertIndividualResult = await individualRepo.insert(individual);

    const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/avatar/upload/individual?userId=${insertIndividualResult.rows[0].userId}`)
        .attach('picture', individualTestImage);

    expect(avatarResponse.statusCode).toBe(200);

    expect(avatarResponse.body.message).toBe(
        `Avatar successfully updated for individual with ID ${userId}`,
    );

    expect(avatarResponse.body.pictureUrl).toContain(
        "amazonaws.com/avatar-individual",
    );

    if ( process.env.SKIP_S3 ) {
        log.log("Skipping S3 image download for testing (SKIP_S3)");
    } else {
        const pictureUrl = avatarResponse.body.pictureUrl;
        const pictureResponse = await reqExt.get(pictureUrl);

        expect(pictureResponse.statusCode).toBe(200);

        // validate successful type conversion / preservation
        expect(pictureResponse.type).toBe("png");

        // DELETION
        process.env.S3_BUCKET_NAME = "MYfakeBUCKET";
        log.log(process.env.S3_BUCKET_NAME);

        const deletionResponse = await request(app)
            .post(`/avatar/delete/individual?userId=${insertIndividualResult.rows[0].userId}`);

        expect(deletionResponse.statusCode).toBe(500);
    }
});

test("deleting a profile picture for an authenticated individual works when mocking S3", async () => {
    // SETUP & INSERTION
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    const insertIndividualResult = await individualRepo.insert(individual);

    const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/avatar/upload/individual?userId=${insertIndividualResult.rows[0].userId}`)
        .attach('picture', individualTestImage);

    expect(avatarResponse.statusCode).toBe(200);

    expect(avatarResponse.body.message).toBe(
        `Avatar successfully updated for individual with ID ${userId}`,
    );

    expect(avatarResponse.body.pictureUrl).toContain(
        "amazonaws.com/avatar-individual",
    );

    process.env.SKIP_S3 = true;

    const deletionResponse = await request(app)
        .post(`/avatar/delete/individual?userId=${insertIndividualResult.rows[0].userId}`);

    expect(deletionResponse.statusCode).toBe(200);
    expect(deletionResponse.body.message).toBe(`Successfully deleted image!`);
});

test("deleting a profile picture for non-existent user fails", async () => {
    // SETUP & INSERTION
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    individual.addressId = addressResult.rows[0].id;
    individual.userId = userId;

    const insertIndividualResult = await individualRepo.insert(individual);

    const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const invalidId = insertIndividualResult.rows[0].userId + 10;

    const avatarResponse = await request(app)
        .post(`/avatar/delete/individual?userId=${invalidId}`)
        .attach('picture', individualTestImage);

    expect(avatarResponse.statusCode).toBe(404);

    expect(avatarResponse.body.message).toBe(
        `There is no individual with ID ${invalidId}`,
    );
});