const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const util = require("../../../util/util");
const validation = require("../../../modules/validation");
const eventService = require("../../../modules/event/eventService");
const selectedCauseRepository = require("../../../models/databaseRepositories/selectedCauseRepository");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");

jest.mock("../../../models/databaseRepositories/addressRepository");
jest.mock("../../../models/databaseRepositories/selectedCauseRepository");
jest.mock("../../../models/databaseRepositories/individualRepository");
jest.mock("../../../models/databaseRepositories/userRepository");
jest.mock("../../../modules/event/eventService");
jest.mock("../../../util/util");
jest.mock("../../../modules/validation");
validation.validateEvent.mockReturnValue({errors: ""});

let eventWithLocationExample1, eventWithLocationExample2, eventWithAllData, animalsEvent,peaceEvent;

beforeEach(() => {
    eventWithLocationExample1 = testHelpers.getEventWithLocationExample1();
    eventWithLocationExample2 = testHelpers.getEventWithLocationExample2();
    womenOnlyEvent = testHelpers.getWomenOnlyEvent();
    physicalEvent = testHelpers.getPhysicalEvent();
    event = testHelpers.getEvent();
    eventWithAllData = testHelpers.getEventWithAllData();
    peaceEvent = testHelpers.getPeaceEvent();
    animalsEvent = testHelpers.getAnimalsEvent();

    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});


test("getting events grouped by causes selected by user works", async () => {
    eventService.getEventsBySelectedCauses.mockResolvedValue({
        status: 200,
        message: "Events fetched successfully",
        data: {
            animals:[{
                ...animalsEvent,
                id: 1,
            }],
            peace:[{
                ...peaceEvent,
                id: 2,
            }]
        },
    })

    const response = await request(app).get("/event/causes?userId=1");
    expect(eventService.getEventsBySelectedCauses).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toMatchObject({
        animals:[{
            ...animalsEvent,
            id: 1,
        }],
        peace:[{
            ...peaceEvent,
            id: 2,
        }]
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
        rows: [eventWithLocationExample1, eventWithLocationExample2],
    });
    const response = await request(app).get("/event/favourites?userId=1");
    expect(individualRepository.findFavouriteEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject(
        [eventWithLocationExample1, eventWithLocationExample2],
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
        rows: [eventWithLocationExample1, eventWithLocationExample2],
    });
    const response = await request(app).get("/event/going?userId=1");
    expect(individualRepository.findGoingEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject(
        [eventWithLocationExample1, eventWithLocationExample2],
    );
});
