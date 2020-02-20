const request = require('supertest');
const app = require('../app');
const testHelpers = require("../test/testHelpers");

const addressRepository = require("../models/addressRepository");
const eventRepository = require("../models/eventRepository");

jest.mock("../models/eventRepository");
jest.mock("../models/addressRepository");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const address = testHelpers.address;
const event = testHelpers.event;
event.organization_id = 1;
event.address_id = 1;


test('creating event with known address works', async () => {
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1
        }]
    });
    const response = await request(app).post("/events").send(event);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({
        ...event,
        id: 1
    });
    expect(response.statusCode).toBe(200);
});

test('updating events works', async () => {
    const mockAddress = {
        ...address,
        id: 1
    };
    addressRepository.update.mockResolvedValue({
        rows: [mockAddress]
    });
    eventRepository.update.mockResolvedValue({
        rows: [{
            ...event,
            id: 1
        }]
    });

    const response = await request(app).post("/events/update").send(event);

    expect(eventRepository.update).toHaveBeenCalledTimes(1);
    expect(addressRepository.update).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        ...event,
        id: 1
    });
    expect(response.statusCode).toBe(200);
});

test('creating event with no address_id creates new address and event', async () => {
    const eventNoAddressId = {
        ...event
    };
    delete eventNoAddressId.address_id;
    const mockAddress = {
        ...address,
        id: 1
    };
    addressRepository.insert.mockResolvedValue({
        rows: [mockAddress]
    });
    eventRepository.insert.mockResolvedValue({
        rows: [{
            ...event,
            id: 1
        }]
    });

    const response = await request(app).post("/events").send(eventNoAddressId);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        ...event,
        id: 1
    });
    expect(response.statusCode).toBe(200);
});
