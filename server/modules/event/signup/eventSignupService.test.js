const testHelpers = require("../../../test/testHelpers");
const eventSignupService = require("./eventSignupService");

const signupRepository = require("../../../models/databaseRepositories/signupRepository");
const eventRepository = require("../../../models/databaseRepositories/eventRepository");

const util = require("../../../util/util");

jest.mock("../../../models/databaseRepositories/signupRepository");
jest.mock("../../../models/databaseRepositories/eventRepository");
jest.mock("../../../util/util");


let signUp, signedUpUserExample1, signedUpUserExample2;
beforeEach(() => {
    signUp = testHelpers.getSignUp();
    signedUpUserExample1 = testHelpers.getSignedUpUserExample1();
    signedUpUserExample2 = testHelpers.getSignedUpUserExample2();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('creating signup works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    signupRepository.insert.mockResolvedValue({
        rows: [{
            signUp,
        }],
    });

    const createSignupResult = await eventSignupService.createSignup(signUp);

    expect(signupRepository.insert).toHaveBeenCalledTimes(1);
    expect(createSignupResult.status).toBe(200);
    expect(createSignupResult.data.signup).toMatchObject({signUp});
});

test('updating works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    signupRepository.update.mockResolvedValue({
        rows: [{
            signUp,
        }],
    });

    const updateSignupResult = await eventSignupService.updateSignUp(signUp);

    expect(signupRepository.update).toHaveBeenCalledTimes(1);
    expect(updateSignupResult.status).toBe(200);
    expect(updateSignupResult.data.signup).toMatchObject({signUp});
});

test('requesting event history works and only returns events from the past', async () => {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    signupRepository.findAllByIndividualId.mockResolvedValue({
        rows: [
            {...signUp, eventId: 4}, {...signUp, eventId: 5},
        ],
    });

    eventRepository.findById.mockReturnValueOnce({
        rows: [
            {id: 4, date: yesterday}
        ],
    }).mockReturnValueOnce({
        rows: [
            {id: 5, date: tomorrow},
        ],
    });

    const updateSignupResult = await eventSignupService.getSignupHistory(15);

    expect(signupRepository.findAllByIndividualId).toHaveBeenCalledTimes(1);
    expect(eventRepository.findById).toHaveBeenCalledTimes(2);
    expect(updateSignupResult.status).toBe(200);
    expect(updateSignupResult.data.events).toMatchObject([{id: 4, date: yesterday}]);
});

test('getting all signups to event works', async () => {
    util.checkEventId.mockResolvedValue({
        status: 200
    });
    signupRepository.findUsersSignedUp.mockResolvedValue({
        rows: [signedUpUserExample1, signedUpUserExample2], // 2 users
    });
    const updateSignupResult = await eventSignupService.getAllSignupsForEvent(15);

    expect(signupRepository.findUsersSignedUp).toHaveBeenCalledTimes(1);
    expect(util.checkEventId).toHaveBeenCalledTimes(1);
    expect(updateSignupResult.status).toBe(200);
    expect(updateSignupResult.data.users).toMatchObject([signedUpUserExample1, signedUpUserExample2]);
});


