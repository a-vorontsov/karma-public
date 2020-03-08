const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/testHelpers");

const favouriteRepository = require("../../../models/databaseRepositories/favouriteRepository");

jest.mock("../../../models/databaseRepositories/eventRepository");
jest.mock("../../../models/databaseRepositories/favouriteRepository");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const favourite = testHelpers.favourite;
const event = testHelpers.event;
event.organizationId = 1;
event.addressId = 1;


test('creating favourite works', async () => {
    favouriteRepository.insert.mockResolvedValue({
        rows: [{
            favourite,
            id: 1,
        }],
    });
    const response = await request(app).post("/event/3/favourite").send(favourite);

    expect(favouriteRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('deleting works', async () => {
    favouriteRepository.remove.mockResolvedValue({
        rows: [{
            favourite,
            id: 1,
        }],
    });
    const response = await request(app).post("/event/3/favourite/delete").send(favourite);

    expect(favouriteRepository.remove).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});
