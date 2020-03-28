const request = require('supertest');
const app = require('../../app');
const testHelpers = require("../../test/helpers");

const causeRepository = require("../../repositories/cause");

jest.mock("../../repositories/cause");


beforeEach(() => {
    process.env.NO_AUTH = 1;
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
    expect(response.body.data).toMatchObject([{
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

test('getting all causes logged in in case of a system error returns error message as expected', async () => {
    causeRepository.findAll.mockImplementation(() => {
      throw new Error("Server error");
    });
    const response = await request(app).get("/causes?userId=69");
    expect(causeRepository.findAll).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('getting all causes in case of a system error returns error message as expected', async () => {
    causeRepository.findAll.mockImplementation(() => {
      throw new Error("Server error");
    });
    const response = await request(app).get("/causes");
    expect(causeRepository.findAll).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('getting cause logged in with invalid id returns corresponding error response', async () => {
    const response = await request(app).get("/causes/1?userId=69");
    expect(response.text).toMatch("{\"message\":\"Cannot read property 'rows' of undefined\"}");
    expect(response.statusCode).toBe(500);
});

test('getting cause with invalid id returns corresponding error response', async () => {
    const response = await request(app).get("/causes/1");
    expect(response.text).toMatch("{\"message\":\"Cannot read property 'rows' of undefined\"}");
    expect(response.statusCode).toBe(500);
});

test('getting a non-existent cause fails as expected', async () => {
    causeRepository.findById.mockResolvedValue({
        rows: [],
    });
    const response = await request(app).get("/causes/69");

    expect(response.body.message).toBe("No cause with given id");
    expect(response.statusCode).toBe(400);
});

test('getting a cause with valid id works', async () => {
    causeRepository.findById.mockResolvedValue({
        rows: [{
            id: 69,
        }],
    });
    const response = await request(app).get("/causes/69");

    expect(response.statusCode).toBe(200);
    expect(response.body.data[0].id).toBe(69);
});
