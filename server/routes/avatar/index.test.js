const request = require("supertest");
const reqExt = require("superagent");
const app = require("../../app");
const fs = require("fs");
const path = require("path");

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

beforeEach(() => {
    process.env.SKIP_PASSWORD_CHECKS = 0;
    process.env.NO_AUTH = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

// TODO - remove me
test("fetching default individual avatar works", async () => {
///
});

//
// // == Test working default images == //
//
// test("fetching default individual avatar works", async () => {
//     await regRepo.insert(registration);
//
//     const insertUserResult = await userRepo.insert(user);
//     const userId = insertUserResult.rows[0].id;
//
//     const addressResult = await addressRepo.insert(address);
//
//     individual.addressId = addressResult.rows[0].id;
//     individual.userId = userId;
//
//     const insertIndividualResult = await individualRepo.insert(individual);
//     const avatarResponse = await request(app)
//         .get(`/avatar/individual?userId=${insertIndividualResult.rows[0].userId}`);
//
//     expect(avatarResponse.statusCode).toBe(200);
//
//     expect(avatarResponse.body.message).toBe(
//         "Fetched image for user!",
//     );
//     expect(avatarResponse.body.picture_url).toContain(
//         "/default/individual",
//     );
// });
//
// test("fetching default organisation avatar works", async () => {
//     await regRepo.insert(registration);
//
//     const insertUserResult = await userRepo.insert(user);
//     const userId = insertUserResult.rows[0].id;
//
//     const addressResult = await addressRepo.insert(address);
//
//     organisation.addressId = addressResult.rows[0].id;
//     organisation.userId = userId;
//
//     const insertOrganisationResult = await organisationRepo.insert(organisation);
//     const avatarResponse = await request(app)
//         .get(`/avatar/organisation?userId=${insertOrganisationResult.rows[0].userId}`);
//
//     expect(avatarResponse.statusCode).toBe(200);
//
//     expect(avatarResponse.body.message).toBe(
//         "Fetched image for user!",
//     );
//     expect(avatarResponse.body.picture_url).toContain(
//         "/default/organisation",
//     );
// });
//
// // == Test missing user ID fetching == //
//
// test("fetching non-existent individual avatar results in error", async () => {
//     const fakeId = 999;
//
//     const avatarResponse = await request(app)
//         .get(`/avatar/individual?userId=${fakeId}`);
//
//     expect(avatarResponse.statusCode).toBe(404);
//
//     expect(avatarResponse.body.message).toBe(
//         `There is no individual with user ID ${fakeId}`,
//     );
//
//     expect(avatarResponse.body.picture_url).toBe(undefined);
// });
//
// test("fetching non-existent organisation avatar results in error", async () => {
//     const fakeId = 999;
//
//     const avatarResponse = await request(app)
//         .get(`/avatar/organisation?userId=${fakeId}`);
//
//     expect(avatarResponse.statusCode).toBe(404);
//
//     expect(avatarResponse.body.message).toBe(
//         `There is no organisation with user ID ${fakeId}`,
//     );
//
//     expect(avatarResponse.body.picture_url).toBe(undefined);
// });
//
// // == Test updating a profile picture == //
// //
// // test("updating a profile picture for an authenticated individual works", async () => {
// //     if (!process.env.SKIP_S3_FOR_TESTING) {
// //         await regRepo.insert(registration);
// //
// //         const insertUserResult = await userRepo.insert(user);
// //         const userId = insertUserResult.rows[0].id;
// //
// //         const addressResult = await addressRepo.insert(address);
// //
// //         individual.addressId = addressResult.rows[0].id;
// //         individual.userId = userId;
// //
// //         const insertIndividualResult = await individualRepo.insert(individual);
// //
// //         const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");
// //
// //         const avatarResponse = await request(app)
// //             .post(`/avatar/upload/individual?userId=${insertIndividualResult.rows[0].userId}`)
// //             .attach('picture', individualTestImage);
// //
// //         expect(avatarResponse.statusCode).toBe(200);
// //
// //         expect(avatarResponse.body.message).toBe(
// //             `Avatar successfully updated for individual with ID ${userId}`,
// //         );
// //
// //         expect(avatarResponse.body.picture_url).toContain(
// //             "amazonaws.com/avatar-individual",
// //         );
// //
// //         const pictureUrl = avatarResponse.body.picture_url;
// //         const pictureResponse = await reqExt.get(pictureUrl);
// //
// //         expect(pictureResponse.statusCode).toBe(200);
// //
// //         // validate successful type conversion / preservation
// //         expect(pictureResponse.type).toBe("png");
// //     }
// // });
// //
// // test("updating a profile picture for an authenticated organisation works", async () => {
// //     if (!process.env.SKIP_S3_FOR_TESTING) {
// //         await regRepo.insert(registration);
// //
// //         const insertUserResult = await userRepo.insert(user);
// //         const userId = insertUserResult.rows[0].id;
// //
// //         const addressResult = await addressRepo.insert(address);
// //
// //         organisation.addressId = addressResult.rows[0].id;
// //         organisation.userId = userId;
// //
// //         const insertOrganisationResult = await organisationRepo.insert(organisation);
// //
// //         const organisationTestImage = path.join(__dirname, "../../modules/picture/resources/organisationTest.png");
// //
// //         const avatarResponse = await request(app)
// //             .post(`/avatar/upload/organisation?userId=${insertOrganisationResult.rows[0].userId}`)
// //             .attach('picture', organisationTestImage);
// //
// //         expect(avatarResponse.statusCode).toBe(200);
// //
// //         expect(avatarResponse.body.message).toBe(
// //             `Avatar successfully updated for organisation with ID ${userId}`,
// //         );
// //
// //         expect(avatarResponse.body.picture_url).toContain(
// //             "amazonaws.com/avatar-organisation",
// //         );
// //
// //         const pictureUrl = avatarResponse.body.picture_url;
// //         const pictureResponse = await reqExt.get(pictureUrl);
// //
// //         expect(pictureResponse.statusCode).toBe(200);
// //
// //         // validate successful type conversion / preservation
// //         expect(pictureResponse.type).toBe("png");
// //     }
// // });
//
// test("updating a profile picture for an unauthenticated user fails", async () => {
//     await regRepo.insert(registration);
//
//     const insertUserResult = await userRepo.insert(user);
//     const userId = insertUserResult.rows[0].id;
//
//     const addressResult = await addressRepo.insert(address);
//
//     individual.addressId = addressResult.rows[0].id;
//     individual.userId = userId;
//
//     await individualRepo.insert(individual);
//     const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");
//
//     const avatarResponse = await request(app)
//         .post(`/avatar/upload/individual`)
//         .attach('picture', individualTestImage);
//
//     expect(avatarResponse.statusCode).not.toBe(200);
// });
//
// // == Test deleting a profile picture == //
// //
// // test("deleting a profile picture for an authenticated individual works", async () => {
// //     if (!process.env.SKIP_S3_FOR_TESTING) {
// //         // SETUP & INSERTION
// //
// //         await regRepo.insert(registration);
// //
// //         const insertUserResult = await userRepo.insert(user);
// //         const userId = insertUserResult.rows[0].id;
// //
// //         const addressResult = await addressRepo.insert(address);
// //
// //         individual.addressId = addressResult.rows[0].id;
// //         individual.userId = userId;
// //
// //         const insertIndividualResult = await individualRepo.insert(individual);
// //
// //         const individualTestImage = path.join(__dirname, "../../modules/picture/resources/individualTest.jpeg");
// //
// //         const avatarResponse = await request(app)
// //             .post(`/avatar/upload/individual?userId=${insertIndividualResult.rows[0].userId}`)
// //             .attach('picture', individualTestImage);
// //
// //         expect(avatarResponse.statusCode).toBe(200);
// //
// //         expect(avatarResponse.body.message).toBe(
// //             `Avatar successfully updated for individual with ID ${userId}`,
// //         );
// //
// //         expect(avatarResponse.body.picture_url).toContain(
// //             "amazonaws.com/avatar-individual",
// //         );
// //
// //         const pictureUrl = avatarResponse.body.picture_url;
// //         const pictureResponse = await reqExt.get(pictureUrl);
// //
// //         expect(pictureResponse.statusCode).toBe(200);
// //
// //         // validate successful type conversion / preservation
// //         expect(pictureResponse.type).toBe("png");
// //
// //         // DELETION
// //
// //         const deletionResponse = await request(app)
// //             .post(`/avatar/delete/individual?userId=${insertIndividualResult.rows[0].userId}`);
// //
// //         expect(deletionResponse.statusCode).toBe(200);
// //         expect(deletionResponse.body.message).toBe(`Successfully deleted image!`);
// //         expect(deletionResponse.body.old_location).toBe(`${pictureUrl}`);
// //     }
// // });