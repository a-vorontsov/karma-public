const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const validation = require("../../../modules/validation");
const eventFavouriteService = require("../../../modules/event/favourite/eventFavouriteService");

jest.mock("../../../modules/event/favourite/eventFavouriteService");
jest.mock("../../../modules/validation");
validation.validateFavourite.mockReturnValue({errors: ""});

const favouriteRepository = require("../../../models/databaseRepositories/favouriteRepository");

let favourite;

beforeEach(() => {
    favourite = testHelpers.getFavourite();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('creating favourite works', async () => {
    eventFavouriteService.createEventFavourite.mockResolvedValue({
        status: 200,
        message: "Favourite created successfully",
        data: {favourite},
    });

    const eventId = 3;
    const response = await request(app)
        .post("/event/" + eventId + "/favourite")
        .send({individualId: 5});

    expect(validation.validateFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.createEventFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.createEventFavourite).toHaveBeenCalledWith({
        individualId: 5,
        eventId: eventId,
    });

    expect(response.body.data).toMatchObject({
        favourite
    });
    expect(response.statusCode).toBe(200);
});

test('deleting favourites works', async () => {
    eventFavouriteService.deleteEventFavourite.mockResolvedValue({
        status: 200,
        message: "Favourite deleted successfully",
        data: {favourite},
    });

    const eventId = 3;
    const response = await request(app)
        .post("/event/" + eventId + "/favourite/delete")
        .send({individualId: 5});

    expect(validation.validateFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.deleteEventFavourite).toHaveBeenCalledTimes(1);
    expect(eventFavouriteService.deleteEventFavourite).toHaveBeenCalledWith({
        individualId: 5,
        eventId: eventId,
    });

    expect(response.body.data).toMatchObject({
        favourite
    });
    expect(response.statusCode).toBe(200);
});
