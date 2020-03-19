const request = require('supertest');
const app = require('../../../app');
const testHelpers = require("../../../test/testHelpers");
const validation = require("../../../modules/validation");
const eventSignupService = require("../../../modules/event/signup/eventSignupService");
const util = require("../../../util/util");

jest.mock("../../../modules/event/signup/eventSignupService");
jest.mock("../../../modules/validation");
jest.mock("../../../util/util");

validation.validateSignup.mockReturnValue({errors: ""});

let signUp, event, signedUpUserExample1, signedUpUserExample2;
beforeEach(() => {
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
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.createSignup.mockResolvedValue({
        status: 200,
        message: "Signup created successfully",
        data: {signup: {signUp}},
    });

    const response = await request(app).post("/event/3/signUp").send(signUp);

    expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.createSignup).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.signup).toMatchObject({
        signUp
    });
});

test('updating works', async () => {
    eventSignupService.updateSignUp.mockResolvedValue({
        status: 200,
        message: "Signup updated successfully",
        data: {signup: {signUp}},
    });

    const response = await request(app).post("/event/3/signUp/update").send(signUp);

    expect(validation.validateSignup).toHaveBeenCalledTimes(1);
    expect(eventSignupService.updateSignUp).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.signup).toMatchObject({
        signUp
    });
});

test('requesting event signups works', async () => {
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

test('requesting signup history for user works', async () => {
    util.getIndividualIdFromUserId.mockResolvedValue(23);
    eventSignupService.getSignupHistory.mockResolvedValue({
        status: 200,
        message: "History fetched successfully",
        data: {events: [{} , {}]}, // 2 events
    });

    const response = await request(app).get("/event/signUp/history").query({userId: 55}).send();

    expect(eventSignupService.getSignupHistory).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
    expect(response.body.data.events).toMatchObject([{}, {}]);
});
