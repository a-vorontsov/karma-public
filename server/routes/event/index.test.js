const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/helpers");
const validation = require("../../modules/validation");
const eventService = require("../../modules/event");
const paginator = require("../../modules/pagination");

jest.mock("../../modules/event");
jest.mock("../../modules/validation");
jest.mock("../../modules/pagination");

let eventWithLocation; let eventWithAllData; let event;

beforeEach(() => {
    process.env.NO_AUTH = 1;
    event = testHelpers.getEvent();
    eventWithLocation = testHelpers.getEventWithLocationExample1();
    eventWithAllData = testHelpers.getEventWithAllData();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("event info fetching endpoint works", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
    eventService.getEventData.mockResolvedValue({
        status: 200,
        message: "Event fetched successfully",
        data: {
            event: eventWithLocation,
        },
    });

    const eventId = 3;
    const response = await request(app)
        .get(`/event/${eventId}`)
        .send();

    expect(eventService.getEventData).toHaveBeenCalledTimes(1);
    expect(eventService.getEventData).toHaveBeenCalledWith(eventId);
    expect(response.body.data).toMatchObject({
        event: eventWithLocation,
    });
    expect(response.statusCode).toBe(200);
});

test("event info fetching endpoint in case of a system error returns error message as expected", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
    eventService.getEventData.mockImplementation(() => {
      throw new Error("Server error");
    });

    const eventId = 3;
    const response = await request(app)
        .get(`/event/${eventId}`)
        .send();

    expect(eventService.getEventData).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test("event creation endpoint works", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
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
        eventWithLocation,
    });
    expect(response.statusCode).toBe(200);
});

test("event creation endpoint works", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
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
        eventWithLocation,
    });
    expect(response.statusCode).toBe(200);
});

test("event creation endpoint in case of a system error returns error message as expected", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
    eventService.createNewEvent.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app)
        .post("/event")
        .send(eventWithLocation);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.createNewEvent).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test("event creation with invalid data is rejected as expected", async () => {
    validation.validateEvent.mockReturnValue({errors: "error"});
    eventService.createNewEvent.mockResolvedValue({
        status: 200,
        message: "Event created successfully",
        data: {eventWithLocation},
    });

    const response = await request(app)
        .post("/event")
        .send(eventWithLocation);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.createNewEvent).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("Input validation failed");
    expect(response.statusCode).toBe(400);
});

test("getting all events works", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
    eventService.getEvents.mockResolvedValue({
        status: 200,
        message: "Events fetched successfully",
        data: {
            events: [
                {...eventWithAllData, id: 1},
            ],
        },
    });

    paginator.getPageData.mockResolvedValue({
        meta: {
            currentPage: 1,
            pageCount: 1,
            pageSize: 1,
            count: 3,
        },
        events: [
            {...eventWithAllData, id: 1},
        ],
    });
    const response = await request(app).get("/event?userId=1&currentPage=1&pageSize=1");
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toEqual([
        {...eventWithAllData, id: 1},
    ]);
    expect(response.body.data.meta).toMatchObject({
        currentPage: 1,
        pageCount: 1,
        pageSize: 1,
        count: 3,
    });
});

test("getting all events endpoint in case of a system error returns error message as expected", async () => {
    eventService.getEvents.mockResolvedValue({
        status: 200,
        message: "Events fetched successfully",
        data: {
            events: [
                {...eventWithAllData, id: 1},
            ],
        },
    });

    paginator.getPageData.mockImplementation(() => {
      throw new Error("Server error");
    });
    const response = await request(app).get("/event?userId=1&currentPage=1&pageSize=1");
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test("getting all events with filters applied works", async () => {
    eventService.getEvents.mockResolvedValue({
        status: 200,
        message: "Events fetched successfully",
        data: {
            events: [
                {...eventWithAllData, id: 1},
            ],
        },
    });

    paginator.getPageData.mockResolvedValue({
        meta: {
            currentPage: 1,
            pageCount: 1,
            pageSize: 1,
            count: 3,
        },
        events: [
            {...eventWithAllData, id: 1},
        ],
    });
    const response = await request(app).get("/event?userId=1&currentPage=1&pageSize=1"+
    "&filter[]=!womenOnly&filter[]=physical&maxDistance=500&avalabilityStart=\"2020-03-03\"&avalabilityEnd=\"2020-05-03\"");
    expect(eventService.getEvents).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toEqual([
        {...eventWithAllData, id: 1},
    ]);
    expect(response.body.data.meta).toMatchObject({
        currentPage: 1,
        pageCount: 1,
        pageSize: 1,
        count: 3,
    });
});

test("event updating endpoint works", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
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
        eventWithLocation,
    });
    expect(response.statusCode).toBe(200);
});

test("event updating endpoint in case of a system error returns error message as expected", async () => {
    validation.validateEvent.mockReturnValue({errors: ""});
    eventService.updateEvent.mockImplementation(() => {
      throw new Error("Server error");
    });

    const eventId = 3;
    const response = await request(app)
        .post(`/event/update/${eventId}`)
        .send(eventWithLocation);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.updateEvent).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test("event updating with invalid data is rejected as expected", async () => {
    validation.validateEvent.mockReturnValue({errors: "error"});
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
    expect(eventService.updateEvent).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("Input validation failed");
    expect(response.statusCode).toBe(400);
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

test("event deleting endpoint in case of a system error returns error message as expected", async () => {
    eventService.deleteEvent.mockImplementation(() => {
      throw new Error("Server error");
    });

    const eventId = 3;
    const response = await request(app)
        .post(`/event/${eventId}/delete?eventId`);

    expect(eventService.deleteEvent).toHaveBeenCalledTimes(1);
    expect(eventService.deleteEvent).toHaveBeenCalledWith(eventId);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});
