const request = require('supertest');
const app = require('../app');
const testHelpers = require("../test/testHelpers");

const causeRepository = require("../models/causeRepository");

jest.mock("../models/causeRepository");


beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const cause = testHelpers.cause;


test('getting all causes works', async () => {
    causeRepository.findAll.mockResolvedValue({
        rows: [{
            ...cause,
            id: 1,
        }],
    });
    const response = await request(app).get("/causes");
    expect(causeRepository.findAll).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject([{
        ...cause,
        id: 1,
    }]);
    expect(response.statusCode).toBe(200);
});
test('getting cause with wrong id format returns corresponding error response', async () => {
    const response = await request(app).get("/causes/dsf");
    expect(response.statusCode).toBe(400);
    expect(response.text).toMatch("ID specified is in wrong format");
});
