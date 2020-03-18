const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const util = require("../../../util/util");
const validation = require("../../../modules/validation");
const eventService = require("../../../modules/event/eventService");
const eventFavouriteService = require("../../../modules/event/favourite/eventFavouriteService");
const eventSignUpService = require("../../../modules/event/signup/eventSignupService");
const selectedCauseRepository = require("../../../models/databaseRepositories/selectedCauseRepository");
const individualRepository = require("../../../models/databaseRepositories/individualRepository");

jest.mock("../../../models/databaseRepositories/addressRepository");
jest.mock("../../../models/databaseRepositories/selectedCauseRepository");
jest.mock("../../../models/databaseRepositories/individualRepository");
jest.mock("../../../models/databaseRepositories/userRepository");

jest.mock("../../../modules/event/eventService");
jest.mock("../../../modules/event/favourite/eventFavouriteService");
jest.mock("../../../modules/event/signup/eventSignupService");

jest.mock("../../../util/util");
jest.mock("../../../modules/validation");
validation.validateEvent.mockReturnValue({errors: ""});

let eventWithLocationExample1, eventWithLocationExample2, eventWithAllData, animalsEvent,peaceEvent, event1, event2;

beforeEach(() => {
    eventWithLocationExample1 = testHelpers.getEventWithLocationExample1();
    eventWithLocationExample2 = testHelpers.getEventWithLocationExample2();
    womenOnlyEvent = testHelpers.getWomenOnlyEvent();
    physicalEvent = testHelpers.getPhysicalEvent();
    event1 = testHelpers.getEventWithLocationExample1();
    event2 = testHelpers.getEventWithLocationExample2();
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
    eventFavouriteService.getFavouriteEvents.mockResolvedValue({
        status: 200,
        message: "Favourite events fetched successfully",
        data: {
            events: [
                {...event1, eventid:1},
            ],
        },
    });
    const response = await request(app).get("/event/favourites?userId=1");
    expect(eventFavouriteService.getFavouriteEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toEqual([
        {...event1, eventid:1},
    ]);
});

test("getting events user is going to works", async () => {
    eventSignUpService.getGoingEvents.mockResolvedValue({
        status: 200,
        message: "Future going events fetched successfully",
        data: {
            events: [
                {...event1, eventid:1},
            ],
        },
    });
    const response = await request(app).get("/event/going?userId=1");
    expect(eventSignUpService.getGoingEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toEqual([
        {...event1, eventid:1},
    ]);
});
