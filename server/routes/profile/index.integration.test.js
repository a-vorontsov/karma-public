const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/helpers");
const userRepo = require("../../repositories/user");
const indivRepo = require("../../repositories/individual");
const regRepo = require("../../repositories/registration");
const eventRepo = require("../../repositories/event");
const profileRepo = require("../../repositories/profile");
const eventSignupRepo = require("../../repositories/event/signup");
const addressRepo = require("../../repositories/address");
const selectedCauseRepo = require("../../repositories/cause/selected");
const authService = require("../../modules/authentication/");

jest.mock("../../repositories/user");
jest.mock("../../repositories/individual");
jest.mock("../../repositories/event");
jest.mock("../../repositories/event/signup");
jest.mock("../../repositories/profile");
jest.mock("../../repositories/address");
jest.mock("../../repositories/cause/selected");

const user = testHelpers.getUserExample4();
const registration = testHelpers.getRegistrationExample5();

afterEach(() => {
    jest.clearAllMocks();
});

test('viewing the profile of another user returns error message in case of a server error as expected', async () => {
    process.env.NO_AUTH=1;

    userRepo.findById.mockImplementation(() => {
        throw new Error("Server error");
    });
    const response = await request(app)
        .get("/profile?otherUserId=1")
        .send();

    expect(userRepo.findById).toHaveBeenCalledTimes(1);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Server error");

    process.env.NO_AUTH=0;
});

test('viewing the profile of another event attending user works', async () => {
    process.env.NO_AUTH=1;

    userRepo.findById.mockResolvedValue({
        rows: [{
            id: 1,
        }],
    });

    eventRepo.findAllByUserIdWithLocation.mockResolvedValue({
        rows: [
            {
                date: Date.parse("01/01/2030"),
                title: "date0",
                id: 0,
                volunteers:[31,23],
                favourited:[21,21],
            },
            {
                date: Date.parse("02/01/2030"),
                title: "date1",
                id: 1,
                volunteers:[31,23],
                favourited:[21,21],
            },
            {
                date: Date.parse("01/01/1930"),
                title: "date2",
                id: 2,
                volunteers:[31,23],
                favourited:[21,21],
            },
        ],
    });

    selectedCauseRepo.findByUserId.mockResolvedValue({
        rows: [
            {name: "cause1"},
            {name: "cause2"},
        ],
    });

    indivRepo.findByUserID.mockResolvedValue({
        rows: [
            {
                id: 1,
            },
        ],
    });

    addressRepo.findById.mockResolvedValue({
        rows: [
            {},
        ],
    });

    profileRepo.findByIndividualId.mockResolvedValue({
        rows: [
            {},
        ],
    });

    eventSignupRepo.findAllByIndividualIdConfirmed.mockResolvedValue({
        rows: [
            {eventId: 0},
            {eventId: 2},
        ],
    });

    eventRepo.findById.mockImplementation((eventId) => {
        switch (eventId) {
            case 0:
                return {
                    rows: [{
                        date: Date.parse("01/01/2030"),
                        title: "date0",
                        id: 0,
                        volunteers:[31,23],
                        favourited:[21,21],
                    }],
                };
                break;

            case 1:
                return {
                    rows: [{
                        date: Date.parse("02/01/2030"),
                        title: "date1",
                        id: 1,
                        volunteers:[31,23],
                        favourited:[21,21],
                    }],
                };
                break;

            case 2:
                return {
                    rows: [{
                        date: Date.parse("01/01/1930"),
                        title: "date2",
                        id: 2,
                        volunteers:[31,23],
                        favourited:[21,21],
                    }],
                };
                break;

            default:
                return {rows: []};
        }
    });

    const response = await request(app)
        .get("/profile?otherUserId=1")
        .send();

    expect(userRepo.findById).toHaveBeenCalledTimes(1);

    expect(response.body.message).toBe("Found individual profile for user.");
    expect(response.statusCode).toBe(200);

    expect(response.body.data.upcomingEvents[0].id).toBe(0);
    expect(response.body.data.pastEvents[0].id).toBe(2);
    expect(response.body.data.causes[0].name).toBe("cause1");
    expect(response.body.data.causes[1].name).toBe("cause2");
    expect(response.body.data.createdEvents[0].id).toBe(0);
    expect(response.body.data.createdEvents[1].id).toBe(1);
    expect(response.body.data.createdPastEvents[0].id).toBe(2);

    process.env.NO_AUTH=0;
});
