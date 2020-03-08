const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/testHelpers");
const util = require("../../util/util");
const validation = require("../../modules/validation");

const addressRepository = require("../../models/databaseRepositories/addressRepository");
const eventRepository = require("../../models/databaseRepositories/eventRepository");


jest.mock("../../models/databaseRepositories/eventRepository");
jest.mock("../../models/databaseRepositories/addressRepository");
jest.mock("../../models/databaseRepositories/selectedCauseRepository");
jest.mock("../../util/util");
jest.mock("../../modules/validation");
validation.validateEvent.mockReturnValue({errors: ""});

let eventWithLocation, eventWithLocation2, womenOnlyEvent, physicalEvent, address, event;

beforeEach(() => {
    eventWithLocation = testHelpers.getEventWithLocationExample1();
    eventWithLocation2 = testHelpers.getEventWithLocationExample2();
    womenOnlyEvent = testHelpers.getWomenOnlyEvent();
    physicalEvent = testHelpers.getPhysicalEvent();
    address = testHelpers.getAddress();
    event = testHelpers.getEvent();
    event.organizationId = 1;
    event.addressId = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("creating event with known address works", async () => {
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1,
        }],
    });
    const response = await request(app)
        .post("/event")
        .send(event);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(0);
    expect(response.body.data).toMatchObject({
        ...event,
        id: 1,
    });
    expect(response.statusCode).toBe(200);
});

test("updating events works", async () => {
    const mockAddress = {
        ...address,
        id: 1,
    };
    addressRepository.update.mockResolvedValue({
        rows: [mockAddress],
    });
    eventRepository.update.mockResolvedValue({
        rows: [{
            ...event,
            id: 3,
        }],
    });

    const response = await request(app)
        .post("/event/update/3")
        .send({
            event,
            address: mockAddress,
        });

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventRepository.update).toHaveBeenCalledTimes(1);
    expect(addressRepository.update).toHaveBeenCalledTimes(1);
    expect(response.body.data).toMatchObject({
        ...event,
        id: 3,
    });

    expect(response.statusCode).toBe(200);
});

test("requesting specific event data works", async () => {
    eventRepository.findById.mockResolvedValue({
        rows: [{
            ...event,
            id: 3,
        }],
    });
    addressRepository.findById.mockResolvedValue({
        rows: [address],
    });
    const response = await request(app).get("/event/3");

    expect(eventRepository.findById).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledWith("3");
    expect(addressRepository.findById).toHaveBeenCalledWith(event.addressId);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toMatchObject({
        ...event,
        id: 3,
    });
});

test("error returned when user tries to exceed monthly event creation limit", async () => {
    util.isIndividual.mockResolvedValue(true);
    eventRepository.findAllByUserId.mockResolvedValue({
        rows: [{}, {}, {}, {}],
    }); // 4 events
    const response = await request(app)
        .post("/event")
        .send(event);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
});

test("creating event with no addressId creates new address and event", async () => {
    util.isIndividual.mockResolvedValue(false);
    const eventNoAddressId = {
        ...event,
        address: address,
    };
    delete eventNoAddressId.addressId;
    const mockAddress = {
        ...address,
        id: 1,
    };
    addressRepository.insert.mockResolvedValue({
        rows: [mockAddress],
    });
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1,
        }],
    });

    const response = await request(app)
        .post("/event")
        .send(eventNoAddressId);

    expect(validation.validateEvent).toHaveBeenCalledTimes(1);
    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.body.data).toMatchObject({
        ...event,
        id: 1,
    });
    expect(response.statusCode).toBe(200);
});
