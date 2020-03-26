const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const validation = require("../../../modules/validation");
const eventFavouriteService = require("../../../modules/event/favourite");
const util = require("../../../util");

jest.mock("../../../modules/event/favourite");
jest.mock("../../../modules/validation");
jest.mock("../../../util");
validation.validateFavourite.mockReturnValue({errors: ""});

const favouriteRepository = require("../../../repositories/favourite");

let favourite;

beforeEach(() => {
    process.env.NO_AUTH = 1;
    favourite = testHelpers.getFavourite();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('creating favourite works', async () => {
    util.getIndividualIdFromUserId.mockResolvedValue(5);
    eventFavouriteService.createEventFavourite.mockResolvedValue({
        status: 200,
        message: "Favourite created successfully",
        data: {favourite},
    });

    const eventId = 3;
    const response = await request(app)
        .post("/event/" + eventId + "/favourite")
        .send({userId: 23});

    expect(validation.validateFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.createEventFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.createEventFavourite).toHaveBeenCalledWith({
        individualId: 5,
        eventId: eventId,
    });

    expect(response.body.data).toMatchObject({
        favourite,
    });
    expect(response.statusCode).toBe(200);
});

test('deleting favourites works', async () => {
    util.getIndividualIdFromUserId.mockResolvedValue(5);
    eventFavouriteService.deleteEventFavourite.mockResolvedValue({
        status: 200,
        message: "Favourite deleted successfully",
        data: {favourite},
    });

    const eventId = 3;
    const response = await request(app)
        .post("/event/" + eventId + "/favourite/delete")
        .send({userId: 25});

    expect(validation.validateFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.deleteEventFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.deleteEventFavourite).toHaveBeenCalledWith({
        individualId: 5,
        eventId: eventId,
    });

    expect(response.body.data).toMatchObject({
        favourite,
    });
    expect(response.statusCode).toBe(200);
});
