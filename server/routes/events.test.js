const request = require('supertest');
const db = require('../database/connection');
const app = require('../app');

const addressRepository = require("../database/addressRepository");
const eventRepository = require("../database/eventRepository");

jest.mock("../database/eventRepository");
jest.mock("../database/addressRepository");

beforeEach(() => {
    db.query("DELETE FROM event");
    db.query("DELETE FROM address");
});

afterEach(() => {
    db.query("DELETE FROM event");
    db.query("DELETE FROM address");
});

const address = {
    address_1: "Line 1",
    address_2: "Line 2",
    postcode: "14 aa",
    city: "LDN",
    region: "LDN again",
    lat: "0.3",
    long: "0.5"
};
const event = {
    address: address,
    name: "event",
    organization_id: 3,
    address_id: 3,
    women_only: true,
    spots: 3,
    address_visible: true,
    minimum_age: 16,
    photo_id: true,
    physical: true,
    add_info: true,
    content: "fun event yay",
    date: "2004-10-19",
    time: "10:23:54"
};

test('creating event with known address works', async () => {
    eventRepository.insert.mockResolvedValue({rows: [{...event, id: 1}]});
    const response = await request(app).post("/events").send(event);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(0);
    expect(response.body).toMatchObject({...event, id: 1});
    expect(response.statusCode).toBe(200);
});

test('creating event with no address_id creates new address and event', async () => {
    const eventNoAddressId = {...event};
    delete eventNoAddressId.address_id;
    const mockAddress = {...address, id: 1};
    addressRepository.insert.mockResolvedValue({rows: [mockAddress]});
    eventRepository.insert.mockResolvedValue({rows: [{...event, id: 1}]});
    const response = await request(app).post("/events").send(eventNoAddressId);

    expect(eventRepository.insert).toHaveBeenCalledTimes(1);
    expect(addressRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({...event, id: 1});
    expect(response.statusCode).toBe(200);
});