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