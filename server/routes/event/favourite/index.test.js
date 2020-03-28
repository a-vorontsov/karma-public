const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/helpers");
const validation = require("../../../modules/validation");
const eventFavouriteService = require("../../../modules/event/favourite");
const util = require("../../../util");

jest.mock("../../../modules/event/favourite");
jest.mock("../../../modules/validation");
jest.mock("../../../util");

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
    validation.validateFavourite.mockReturnValue({errors: ""});
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

test('creating favourite with invalid request params is rejected as expected', async () => {
    validation.validateFavourite.mockReturnValue({errors: "err"});
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
    expect(eventFavouriteService.createEventFavourite).toHaveBeenCalledTimes(0);
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Input validation failed");
});

test('event favourite endpoint in case of a system error returns error message as expected', async () => {
    validation.validateFavourite.mockReturnValue({errors: ""});
    util.getIndividualIdFromUserId.mockResolvedValue(5);
    eventFavouriteService.createEventFavourite.mockImplementation(() => {
      throw new Error("Server error");
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
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('deleting favourites works', async () => {
    validation.validateFavourite.mockReturnValue({errors: ""});
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

test('deleting favourite endpoint in case of a system error returns error message as expected', async () => {
    validation.validateFavourite.mockReturnValue({errors: ""});
    util.getIndividualIdFromUserId.mockResolvedValue(5);
    eventFavouriteService.deleteEventFavourite.mockImplementation(() => {
      throw new Error("Server error");
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
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('deleting favourites with invalid request params is rejected as expected', async () => {
    validation.validateFavourite.mockReturnValue({errors: "err"});
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
    expect(eventFavouriteService.deleteEventFavourite).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("Input validation failed");
    expect(response.statusCode).toBe(400);
});