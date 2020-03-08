const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/testHelpers");
const util = require("../../../util/util");
const signupRepository = require("../../../models/databaseRepositories/signupRepository");
const eventRepository = require("../../../models/databaseRepositories/eventRepository");

jest.mock("../../../models/databaseRepositories/eventRepository");
jest.mock("../../../models/databaseRepositories/signupRepository");
jest.mock("../../../util/util");

beforeEach(() => {
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

const signUp = testHelpers.signUp;
const event = testHelpers.event;
const signedUpUser1 = testHelpers.signedUpUser1;
const signedUpUser2 = testHelpers.signedUpUser2;
event.organization_id = 1;
event.address_id = 1;


test('creating signup works', async () => {
    signupRepository.insert.mockResolvedValue({
        rows: [{
            signUp,
            id: 1,
        }],
    });
    const response = await request(app).post("/event/3/signUp").send(signUp);

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
    const response = await request(app).post("/event/3/signUp/update").send(signUp);

    expect(signupRepository.update).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('requesting event history works', async () => {
    signupRepository.findAllByIndividualId.mockResolvedValue({
        rows: [{}, {}, {}], // 3 events
    });
    const response = await request(app).get("/event/signUp/history").send({
        individual_id: 5
    });

    expect(signupRepository.findAllByIndividualId).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledTimes(3);
    expect(response.statusCode).toBe(200);
});

test('requesting users signed up to an event works', async () => {
    util.checkEventId.mockResolvedValue({
        status: 200
    });
    signupRepository.findUsersSignedUp.mockResolvedValue({
        rows: [{
            signedUpUser1,
            signedUpUser2
        }], // 2 users
    });
    const response = await request(app).get("/event/1/signUp");

    expect(signupRepository.findUsersSignedUp).toHaveBeenCalledTimes(1);
    expect(util.checkEventId).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject([{
        signedUpUser1,
        signedUpUser2
    }]);
});

test('requesting users signed up to an event that doesnt exist returns event does not exist response', async () => {
    util.checkEventId.mockResolvedValue({
        status: 404,
        message: "No event with specified id",
    });

    const response = await request(app).get("/event/1/signUp");

    expect(signupRepository.findUsersSignedUp).toHaveBeenCalledTimes(0);
    expect(util.checkEventId).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(404);
    expect(response.text).toBe("No event with specified id");
});

test('requesting users signed up to an event with wrong id format returns id format is wrong response', async () => {
    util.checkEventId.mockResolvedValue({
        status: 400,
        message: "ID specified is in wrong format",
    });

    const response = await request(app).get("/event/hhh/signUp");

    expect(signupRepository.findUsersSignedUp).toHaveBeenCalledTimes(0);
    expect(util.checkEventId).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(400);
    expect(response.text).toBe("ID specified is in wrong format");
});
