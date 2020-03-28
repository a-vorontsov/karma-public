const causes = require("./");

const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/helpers");

const causeRepository = require("../../../repositories/cause");
const selectedCauseRepository = require("../../../repositories/cause/selected");

jest.mock("../../../repositories/cause");
jest.mock("../../../repositories/cause/selected");

beforeEach(() => {
    process.env.NO_AUTH = 1;
});

afterEach(() => {
    jest.clearAllMocks();
});

test('selecting causes works', async () => {

    const causeSelectRequest = {
        userId: 1,
        data: {
            causes: [
                {
                    title: "a",
                    id: 1,
                },
                {
                    title: "b",
                    id: 2,
                },
                {
                    title: "c",
                    id: 3,
                },
            ]
        }
    };

    selectedCauseRepository.unselectAll.mockResolvedValue(true);

    selectedCauseRepository.insertMultiple.mockResolvedValue({
        rows: [{}]
    });

    const response = await request(app)
        .post("/causes/select")
        .set("authorization", null)
        .send(causeSelectRequest);

    expect(response.body.message).toBe("Successfully selected causes for user");
    expect(response.status).toBe(200);
});

test('selecting causes without any cause specified fails as expected', async () => {

    const causeSelectRequest = {
        userId: 1,
        data: {
        }
    };

    selectedCauseRepository.unselectAll.mockResolvedValue(true);

    selectedCauseRepository.insertMultiple.mockResolvedValue({
        rows: [{}]
    });

    const response = await request(app)
        .post("/causes/select")
        .set("authorization", null)
        .send(causeSelectRequest);

    expect(response.status).toBe(400);
});
test('selecting causes n case of a system error returns error message as expected', async () => {

    const causeSelectRequest = {
        userId: 1,
        data: {
            causes: [
                {
                    title: "a",
                    id: 1,
                },
                {
                    title: "b",
                    id: 2,
                },
                {
                    title: "c",
                    id: 3,
                },
            ]
        }
    };

    selectedCauseRepository.unselectAll.mockResolvedValue(true);

    selectedCauseRepository.insertMultiple.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app)
        .post("/causes/select")
        .set("authorization", null)
        .send(causeSelectRequest);

    expect(response.status).toBe(500);
});
