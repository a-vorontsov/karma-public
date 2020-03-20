const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const validation = require("../../modules/validation");
const eventService = require("../../modules/event/eventService");
const paginator = require("../../modules/pagination");

jest.mock("../../modules/event/eventService");
jest.mock("../../modules/validation");
jest.mock("../../modules/pagination");
validation.validateEvent.mockReturnValue({errors: ""});

let eventWithLocation,eventWithAllData,event;

beforeEach(() => {
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    event = testHelpers.getEvent();
    eventWithLocation = testHelpers.getEventWithLocationExample1();
    eventWithAllData = testHelpers.getEventWithAllData();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("event info fetching endpoint works", async () => {
    eventService.getEventData.mockResolvedValue({
        status: 200,
        message: "Event fetched successfully",
        data: {
            event: eventWithLocation
        },
    });

    const eventId = 3;
    const response = await request(app)
        .get(`/event/${eventId}`)
        .send();

    expect(eventService.getEventData).toHaveBeenCalledTimes(1);
    expect(eventService.getEventData).toHaveBeenCalledWith(eventId);
    expect(response.body.data).toMatchObject({
        event: eventWithLocation
    });
    expect(response.statusCode).toBe(200);
});

test("event creation endpoint works", async () => {
    eventService.createNewEvent.mockResolvedValue({
        status: 200,
        message: "Event created successfully",
        data: {eventWithLocation},
    });

    const response = await request(app)
        .post("/event")
        .send(eventWithLocation);

    expect(response.body.message).toBe("Event created successfully");
    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.createNewEvent).toHaveBeenCalledTimes(1);
    expect(response.body.data).toMatchObject({
        eventWithLocation
    });
    expect(response.statusCode).toBe(200);
});

test("getting all events works", async () => {
    eventService.getEvents.mockResolvedValue({
        status: 200,
        message: "Events fetched successfully",
        data: {
            events: [
                {...eventWithAllData, id:1},
            ],
        },
    });

    paginator.getPageData.mockResolvedValue({
        meta: {
            currentPage: 1,
            pageCount: 1,
            pageSize: 1,
            count: 3
        },
        events: [
                {...eventWithAllData, id:1},
        ],
    })
    const response = await request(app).get("/event?userId=1&currentPage=1&pageSize=1");
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toEqual([
        {...eventWithAllData, id:1},
    ]);
    expect(response.body.data.meta).toMatchObject({
        currentPage: 1,
        pageCount: 1,
        pageSize: 1,
        count: 3
    });
});
test("getting all events with filters applied works", async () => {
    eventService.getEvents.mockResolvedValue({
        status: 200,
        message: "Events fetched successfully",
        data: {
            events: [
                {...eventWithAllData, id:1},
            ],
        },
    });

    paginator.getPageData.mockResolvedValue({
        meta: {
            currentPage: 1,
            pageCount: 1,
            pageSize: 1,
            count: 3
        },
        events: [
                {...eventWithAllData, id:1},
        ],
    })
    const response = await request(app).get("/event?userId=1&currentPage=1&pageSize=1"+
    "&filter[]=!womenOnly&filter[]=physical&maxDistance=500&avalabilityStart=\"2020-03-03\"&avalabilityEnd=\"2020-05-03\"");
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toEqual([
        {...eventWithAllData, id:1},
    ]);
    expect(response.body.data.meta).toMatchObject({
        currentPage: 1,
        pageCount: 1,
        pageSize: 1,
        count: 3
    });
});

test("event updating endpoint works", async () => {
    eventService.updateEvent.mockResolvedValue({
        status: 200,
        message: "Event updated successfully",
        data: {eventWithLocation},
    });

    const eventId = 3;
    const response = await request(app)
        .post(`/event/update/${eventId}`)
        .send(eventWithLocation);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.updateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.updateEvent).toHaveBeenCalledWith({...eventWithLocation, id: eventId});
    expect(response.body.data).toMatchObject({
        eventWithLocation
    });
    expect(response.statusCode).toBe(200);
});

test("event deleting endpoint works", async () => {
    eventService.deleteEvent.mockResolvedValue({
        status: 200,
        message: "Event deleted successfully",
        data: {event: event},
    });

    const eventId = 3;
    const response = await request(app)
        .post(`/event/${eventId}/delete?eventId`);

    expect(eventService.deleteEvent).toHaveBeenCalledTimes(1);
    expect(eventService.deleteEvent).toHaveBeenCalledWith(eventId);
    expect(response.body.data.event).toMatchObject(event);
    expect(response.statusCode).toBe(200);
});
