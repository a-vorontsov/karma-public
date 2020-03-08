const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const util = require("../../../util/util");
const validation = require("../../../modules/validation");

const eventRepository = require("../../../models/databaseRepositories/eventRepository");
const selectedCauseRepository = require("../../../models/databaseRepositories/selectedCauseRepository");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");


jest.mock("../../../models/databaseRepositories/eventRepository");
jest.mock("../../../models/databaseRepositories/addressRepository");
jest.mock("../../../models/databaseRepositories/selectedCauseRepository");
jest.mock("../../../models/databaseRepositories/individualRepository");
jest.mock("../../../models/databaseRepositories/userRepository");
jest.mock("../../../util/util");
jest.mock("../../../modules/validation");
validation.validateEvent.mockReturnValue({errors: ""});

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const eventWithLocation = testHelpers.eventWithLocation1;
const eventWithLocation2 = testHelpers.eventWithLocation2;
const womenOnlyEvent = testHelpers.womenOnlyEvent;
const physicalEvent = testHelpers.physicalEvent;
const event = testHelpers.event;
event.organizationId = 1;
event.addressId = 1;


test("getting all events works", async () => {
    util.checkUserId.mockResolvedValue({
        status: 200,
        user: {
            id: 1,
            lat: 51.414916,
            long: -0.190487,
        },
    });
    eventRepository.getEventsWithLocation.mockResolvedValue({
        rows: [eventWithLocation, eventWithLocation2],
    });
    const response = await request(app).get("/event?userId=1");
    expect(eventRepository.getEventsWithLocation).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject([eventWithLocation, eventWithLocation2]);
});

test("getting only physical events works", async () => {
    util.checkUserId.mockResolvedValue({
        status: 200,
        user: {
            id: 1,
            lat: 51.414916,
            long: -0.190487,
        }
    });
    eventRepository.getEventsWithLocation.mockResolvedValue({
        rows: [physicalEvent]
    });
    const response = await request(app).get("/event?userId=1&filter[]=physical");
    expect(eventRepository.getEventsWithLocation).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject([physicalEvent]);
});

test("getting women only events works", async () => {
    util.checkUserId.mockResolvedValue({
        status: 200,
        user: {
            id: 1,
            lat: 51.414916,
            long: -0.190487,
        }
    });
    eventRepository.getEventsWithLocation.mockResolvedValue({
        rows: [womenOnlyEvent]
    });
    const response = await request(app).get("/event?userId=1&filter[]=womenOnly");
    expect(eventRepository.getEventsWithLocation).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject([womenOnlyEvent]);
});

test("getting events grouped by causes selected by user works", async () => {
    util.checkUserId.mockResolvedValue({
        status: 200,
        user: {
            id: 1,
            lat: 51.414916,
            long: -0.190487,
        },
    });
    selectedCauseRepository.findEventsSelectedByUser.mockResolvedValue({
        rows: [eventWithLocation, eventWithLocation2],
    });
    const response = await request(app).get("/event/causes?userId=1");
    expect(selectedCauseRepository.findEventsSelectedByUser).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toMatchObject({
        peace: [{
            ...eventWithLocation,
        }],
        gardening: [{
            ...eventWithLocation2,
        }],
    });
});

test("getting events favourited by user works", async () => {
    util.checkUserId.mockResolvedValue({
        status: 200,
        user: {
            id: 1,
            lat: 51.414916,
            long: -0.190487,
        },
    });
    individualRepository.findFavouriteEvents.mockResolvedValue({
        rows: [eventWithLocation, eventWithLocation2],
    });
    const response = await request(app).get("/event/favourites?userId=1");
    expect(individualRepository.findFavouriteEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject(
        [eventWithLocation, eventWithLocation2],
    );
});

test("getting events user is going to works", async () => {
    util.checkUserId.mockResolvedValue({
        status: 200,
        user: {
            id: 1,
            lat: 51.414916,
            long: -0.190487,
        },
    });
    individualRepository.findGoingEvents.mockResolvedValue({
        rows: [eventWithLocation, eventWithLocation2],
    });
    const response = await request(app).get("/event/going?userId=1");
    expect(individualRepository.findGoingEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject(
        [eventWithLocation, eventWithLocation2],
    );
});
