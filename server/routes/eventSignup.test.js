const request = require('supertest');
const app = require('../app');
const testHelpers = require("../test/testHelpers");

const signupRepository = require("../models/databaseRepositories/signupRepository");
const eventRepository = require("../models/databaseRepositories/eventRepository");

jest.mock("../models/databaseRepositories/eventRepository");
jest.mock("../models/databaseRepositories/signupRepository");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const signUp = testHelpers.signUp;
const event = testHelpers.event;
event.organization_id = 1;
event.address_id = 1;


test('creating signup works', async () => {
    signupRepository.insert.mockResolvedValue({
        rows: [{
            signUp,
            id: 1,
        }],
    });
    const response = await request(app).post("/event/3/signUp").send(event);

    expect(signupRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('updating works', async () => {
    signupRepository.update.mockResolvedValue({
        rows: [{
            signUp,
            id: 1,
        }],
    });
    const response = await request(app).post("/event/3/signUp/update").send(event);

    expect(signupRepository.update).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('requesting event history works', async () => {
    signupRepository.findAllByIndividualId.mockResolvedValue({
        rows: [{}, {}, {}], // 3 events
    });
    const response = await request(app).get("/event/signUp/history").send({individual_id: 5});

    expect(signupRepository.findAllByIndividualId).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledTimes(3);
    expect(response.statusCode).toBe(200);
});
