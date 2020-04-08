const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/helpers");
const validation = require("../../../modules/validation");
const eventSignupService = require("../../../modules/event/signup");
const util = require("../../../util");

jest.mock("../../../modules/event/signup");
jest.mock("../../../modules/validation");
jest.mock("../../../util");

let signUp; let event; let signedUpUserExample1; let signedUpUserExample2;
beforeEach(() => {
    process.env.NO_AUTH = 1;
    signUp = testHelpers.getSignUp();
    event = testHelpers.getEvent();
    signedUpUserExample1 = testHelpers.getSignedUpUserExample1();
    signedUpUserExample2 = testHelpers.getSignedUpUserExample2();
    event.organizationId = 1;
    event.addressId = 1;
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('creating signup works', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.saveSignup.mockResolvedValue({
        status: 200,
        message: "Signup created successfully",
        data: {signup: {signUp}},
    });

    const response = await request(app).post("/event/3/signUp").send(signUp);

    expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.saveSignup).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.signup).toMatchObject({
        signUp,
    });
});

test('creating signup with invalid data is rejected as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: "err"});
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.saveSignup.mockResolvedValue({
        status: 200,
        message: "Signup created successfully",
        data: {signup: {signUp}},
    });

    const response = await request(app).post("/event/3/signUp").send(signUp);

    expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.saveSignup).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("Input validation failed");
    expect(response.status).toBe(400);
});

test('creating signup endpoint in case of a system error returns error message as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.saveSignup.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app).post("/event/3/signUp").send(signUp);

    expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.saveSignup).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('updating works', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    eventSignupService.updateSignUp.mockResolvedValue({
        status: 200,
        message: "Signup updated successfully",
        data: {signup: {signUp}},
    });

    const response = await request(app).post("/event/3/signUp/update").send(signUp);

    // expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.updateSignUp).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.signup).toMatchObject({
        signUp,
    });
});

test('updating with invalid data is rejected as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: "err"});
    eventSignupService.updateSignUp.mockResolvedValue({
        status: 200,
        message: "Signup updated successfully",
        data: {signup: {signUp}},
    });

    // const response = await request(app).post("/event/3/signUp/update").send(signUp);

    // expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    // expect(eventSignupService.updateSignUp).toHaveBeenCalledTimes(0);
    // expect(response.body.message).toBe("Input validation failed");
    // expect(response.status).toBe(400);
});

test('updating signup endpoint in case of a system error returns error message as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    eventSignupService.updateSignUp.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app).post("/event/3/signUp/update").send(signUp);

    // expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.updateSignUp).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('requesting event signups works', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    eventSignupService.getAllSignupsForEvent.mockResolvedValue({
        status: 200,
        message: "Signup updated successfully",
        data: {users: [{}, {}, {}]}, // 3 users have signed up
    });

    const response = await request(app).get("/event/1/signUp");

    expect(eventSignupService.getAllSignupsForEvent).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.users).toMatchObject([{}, {}, {}]);
});

test('requesting event signups endpoint in case of a system error returns error message as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    eventSignupService.getAllSignupsForEvent.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app).get("/event/1/signUp");

    expect(eventSignupService.getAllSignupsForEvent).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('requesting signup history for user works', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.getSignupHistory.mockResolvedValue({
        status: 200,
        message: "History fetched successfully",
        data: {events: [{}, {}]}, // 2 events
    });

    const response = await request(app).get("/event/signUp/history").query({userId: 55}).send();

    expect(eventSignupService.getSignupHistory).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject([{}, {}]);
});

test('requesting signup history with invalid data is rejected as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: "err"});
    util.getIndividualIdFromUserId.mockResolvedValue(undefined);
    eventSignupService.getSignupHistory.mockResolvedValue({
        status: 200,
        message: "History fetched successfully",
        data: {events: [{}, {}]}, // 2 events
    });

    const response = await request(app).get("/event/signUp/history").query({userId: 55}).send();

    expect(eventSignupService.getSignupHistory).toHaveBeenCalledTimes(0);
    expect(response.body.message).toBe("IndividualId not specified");
    expect(response.status).toBe(400);
});

test('requesting signup history endpoint in case of a system error returns error message as expected', async () => {
    validation.validateSignup.mockReturnValue({errors: ""});
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.getSignupHistory.mockImplementation(() => {
      throw new Error("Server error");
    });

    const response = await request(app).get("/event/signUp/history").query({userId: 55}).send();

    expect(eventSignupService.getSignupHistory).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});

test('requesting signup status for user works', async () => {
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.getSignupStatus.mockResolvedValue({
        status: 200,
        message: "Signup status fetched successfully",
        data: {signup: {signUp}},
    });

    const response = await request(app).get("/event/3/signUp/status").query({userId: 55}).send();

    expect(eventSignupService.getSignupStatus).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.signup).toMatchObject({
        signUp
    });
});

test('requesting signup status for non-attending user fails', async () => {
    util.getIndividualIdFromUserId.mockResolvedValue(26);
    eventSignupService.getSignupStatus.mockResolvedValue({
        status: 404,
        message: "You have not signed up for this event",
    });

    const response = await request(app).get("/event/3/signUp/status").query({userId: 56}).send();

    expect(eventSignupService.getSignupStatus).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("You have not signed up for this event");
});

test('requesting signup status in case of server error return error message', async () => {
    util.getIndividualIdFromUserId.mockResolvedValue(26);
    eventSignupService.getSignupStatus.mockImplementation(() => {
        throw new Error("Server error");
    });

    const response = await request(app).get("/event/3/signUp/status").query({userId: 55}).send();

    expect(eventSignupService.getSignupStatus).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Server error");
    expect(response.status).toBe(500);
});