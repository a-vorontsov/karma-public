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
const eventRepo = require("../../repositories/event");
const pictureRepo = require("../../repositories/picture");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();
const address= testHelpers.getAddress();
const individual = testHelpers.getIndividual();
const organisation = testHelpers.getOrganisation();
const skipS3 = process.env.SKIP_S3;
const bucketName = process.env.S3_BUCKET_NAME;

let eventWithLocation; let eventWithAllData; let event;

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
    process.env.SKIP_S3 = skipS3;
    process.env.S3_BUCKET_NAME = bucketName;
    event = testHelpers.getEvent();
    eventWithLocation = testHelpers.getEventWithLocationExample1();
    eventWithAllData = testHelpers.getEventWithAllData();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

// == Test missing user ID fetching == //

test("fetching non-existent event picture results in error", async () => {
    const fakeId = 999;

    const pictureResponse = await request(app)
        .get(`/picture/event/${fakeId}`);

    expect(pictureResponse.statusCode).toBe(400);

    expect(pictureResponse.body.message).toContain(
        "Could not find event with ID",
    );

    expect(pictureResponse.body.pictureUrl).toBe(undefined);
});

test("fetching non-existent picture results in 400", async () => {
    const fakeId = 999;

    const pictureResponse = await request(app)
        .get(`/picture/${fakeId}`);

    expect(pictureResponse.statusCode).toBe(400);

    expect(pictureResponse.body.message).toContain(
        `Could not find picture with ID of ${fakeId}`,
    );

    expect(pictureResponse.body.pictureUrl).toContain("/picture/default/404");
});

test("fetching real picture works", async () => {
    const pictureResult = await pictureRepo.insert({
        pictureLocation: "myFakePicture",
    });
    const pictureId = pictureResult.rows[0].id;

    const pictureResponse = await request(app)
        .get(`/picture/${pictureId}`);

    expect(pictureResponse.statusCode).toBe(200);

    expect(pictureResponse.body.message).toContain(
        `Fetched image with ${pictureId}`,
    );

    expect(pictureResponse.body.pictureUrl).toContain("myFakePicture");
});

test("fetching event with default picture passes", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);
    const addressId = addressResult.rows[0].id;

    event.addressId = addressId;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const pictureResponse = await request(app)
        .get(`/picture/event/${eventId}`);

    expect(pictureResponse.statusCode).toBe(200);

    expect(pictureResponse.body.message).toContain(
        "No image associated with this event",
    );

    expect(pictureResponse.body.pictureUrl).toContain("picture/default/404");
});

test("fetching event with picture passes", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);
    const addressId = addressResult.rows[0].id;

    const pictureResult = await pictureRepo.insert({
            pictureLocation: "myTestLocation",
        }
    );
    const pictureId = pictureResult.rows[0].id;

    event.addressId = addressId;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;
    event.pictureId = pictureId;
    event.id = eventId;
    const eventUpdateResult = await eventRepo.update(event);
    expect(eventUpdateResult.rows[0].pictureId).toBe(pictureId);

    const pictureResponse = await request(app)
        .get(`/picture/event/${eventId}`);

    expect(pictureResponse.statusCode).toBe(200);

    expect(pictureResponse.body.message).toContain(
        "Fetched image for event!",
    );

    expect(pictureResponse.body.pictureUrl).toContain("myTestLocation");
});

test("fetching default image works", async () => {
    const errResult = await request(app).get(`/picture/default/404`);
    expect(errResult.statusCode).toBe(200);
});

//
// // == Test updating a profile picture == //
//
test("updating a picture for an event as an authenticated user works", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/picture/upload/event/${eventId}?userId=${userId}`)
        .attach('picture', testImage);

    expect(avatarResponse.body.message).toBe(
        `Image successfully updated for event with ID ${eventId}`,
    );

    expect(avatarResponse.body.pictureUrl).toContain(
        "amazonaws.com/",
    );

    expect(avatarResponse.statusCode).toBe(200);

    if ( process.env.SKIP_S3 == true ) {
        log.log("Skipping S3 image download for testing (SKIP_S3)");
    } else {
        const pictureUrl = avatarResponse.body.pictureUrl;
        const pictureResponse = await reqExt.get(pictureUrl);

        expect(pictureResponse.statusCode).toBe(200);

        // validate successful type conversion / preservation
        expect(pictureResponse.type).toBe("png");
    }
});

test("updating a picture for an event as an authenticated user works mocked", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    process.env.SKIP_S3 = "1";

    const avatarResponse = await request(app)
        .post(`/picture/upload/event/${eventId}?userId=${userId}`)
        .attach('picture', testImage);

    expect(avatarResponse.body.message).toBe(
        `Image successfully updated for event with ID ${eventId}`,
    );

    expect(avatarResponse.body.pictureUrl).toContain(
        "amazonaws.com/",
    );

    expect(avatarResponse.statusCode).toBe(200);
});

test("updating an event picture for an unauthenticated user fails", async () => {
    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/avatar/upload/individual`)
        .attach('picture', testImage);

    expect(avatarResponse.statusCode).not.toBe(200);
});

test("updating a picture for an event as the wrong user fails", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/picture/upload/event/${eventId}?userId=${userId + 999}`)
        .attach('picture', testImage);

    expect(avatarResponse.statusCode).toBe(300);
});

test("updating a picture for a non-existent event fails", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/picture/upload/event/${eventId + 999}?userId=${userId}`)
        .attach('picture', testImage);

    expect(avatarResponse.statusCode).toBe(404);
});
//
// // == Test deleting an event picture == //

test("deleting a picture for an event as an authenticated user works", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/picture/upload/event/${eventId}?userId=${userId}`)
        .attach('picture', testImage);

    expect(avatarResponse.body.message).toBe(
        `Image successfully updated for event with ID ${eventId}`,
    );

    expect(avatarResponse.body.pictureUrl).toContain(
        "amazonaws.com/",
    );

    expect(avatarResponse.statusCode).toBe(200);

    if ( process.env.SKIP_S3 == true ) {
        log.log("Skipping S3 image download for testing (SKIP_S3)");
    } else {
        const pictureUrl = avatarResponse.body.pictureUrl;
        const pictureResponse = await reqExt.get(pictureUrl);

        // validate successful type conversion / preservation
        expect(pictureResponse.type).toBe("png");
        expect(pictureResponse.statusCode).toBe(200);

        const deletionResponse = await request(app)
            .post(`/picture/delete/event/${eventId}?userId=${userId}`);

        expect(deletionResponse.body.message).toContain("Successfully deleted image!");
        expect(deletionResponse.statusCode).toBe(200);
    }
});

test("deleting a picture for an event as an unauthenticated user fails", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    const avatarResponse = await request(app)
        .post(`/picture/upload/event/${eventId}?userId=${userId}`)
        .attach('picture', testImage);

    expect(avatarResponse.body.message).toBe(
        `Image successfully updated for event with ID ${eventId}`,
    );

    expect(avatarResponse.body.pictureUrl).toContain(
        "amazonaws.com/",
    );

    expect(avatarResponse.statusCode).toBe(200);

    if ( process.env.SKIP_S3 == true ) {
        log.log("Skipping S3 image download for testing (SKIP_S3)");
    } else {
        const pictureUrl = avatarResponse.body.pictureUrl;
        const pictureResponse = await reqExt.get(pictureUrl);

        expect(pictureResponse.statusCode).toBe(200);

        // validate successful type conversion / preservation
        expect(pictureResponse.type).toBe("png");

        const deletionResponse = await request(app)
            .post(`/picture/delete/event/${eventId}`);

        expect(deletionResponse.statusCode).toBe(300);
    }
});

test("deleting a picture for an nonexistent event as an authenticated user fails", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const deletionResponse = await request(app)
        .post(`/picture/delete/event/${eventId + 999}?userId=${userId}`);

    expect(deletionResponse.body.message).toContain("There is no event with ID");
});

test("deleting a picture for an event as an authenticated user works mocked", async () => {
    await regRepo.insert(registration);

    const insertUserResult = await userRepo.insert(user);
    const userId = insertUserResult.rows[0].id;

    const addressResult = await addressRepo.insert(address);

    event.addressId = addressResult.rows[0].id;
    event.userId = userId;
    const eventResult = await eventRepo.insert(event);
    const eventId = eventResult.rows[0].id;

    const testImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");

    process.env.SKIP_S3 = "1";

    const pictureResponse = await request(app)
        .post(`/picture/upload/event/${eventId}?userId=${userId}`)
        .attach('picture', testImage);

    expect(pictureResponse.body.message).toBe(
        `Image successfully updated for event with ID ${eventId}`,
    );

    expect(pictureResponse.body.pictureUrl).toContain(
        "amazonaws.com/",
    );

    expect(pictureResponse.statusCode).toBe(200);

    const deletionResponse = await request(app)
        .post(`/picture/delete/event/${eventId}?userId=${userId}`);

    expect(deletionResponse.body.message).toContain("Successfully deleted image!");
    expect(deletionResponse.statusCode).toBe(200);
});