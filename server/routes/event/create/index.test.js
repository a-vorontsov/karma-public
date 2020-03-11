const request = require("supertest");
const app = require("../../../app");
const testHelpers = require("../../../test/testHelpers");
const validation = require("../../../modules/validation");
const eventService = require("../../../modules/eventService");

jest.mock("../../../modules/eventService");
jest.mock("../../../modules/validation");
validation.validateEvent.mockReturnValue({errors: ""});

let eventWithLocation;

beforeEach(() => {
    eventWithLocation = testHelpers.getEventWithLocationExample1();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("event creation works", async () => {
    eventService.createNewEvent.mockResolvedValue({
        status: 200,
        message: "Event created successfully",
        data: {eventWithLocation},
    });

    const response = await request(app)
        .post("/event/create")
        .send(eventWithLocation);

    expect(response.body.message).toBe("Event created successfully");
    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventService.createNewEvent).toHaveBeenCalledTimes(1);
    expect(response.body.data).toMatchObject({
        eventWithLocation
    });
    expect(response.statusCode).toBe(200);
});