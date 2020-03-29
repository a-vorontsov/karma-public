const testHelpers = require("../../../test/helpers");
const eventSignupService = require("./");

const individualRepository = require("../../../repositories/individual");
const signupRepository = require("../../../repositories/event/signup");
const eventRepository = require("../../../repositories/event");
const eventSorter = require("../../sorting");
const profileRepo = require("../../../repositories/profile");
const util = require("../../../util");

jest.mock("../../../repositories/event/signup");
jest.mock("../../../repositories/event");
jest.mock("../../../repositories/individual");
jest.mock("../../../repositories/profile");
jest.mock("../../../util");
jest.mock("../../sorting");

let signUp, signedUpUserExample1, signedUpUserExample2, event1, event2, profile, eventWithAllData;
beforeEach(() => {
    signUp = testHelpers.getSignUp();
    signedUpUserExample1 = testHelpers.getSignedUpUserExample1();
    signedUpUserExample2 = testHelpers.getSignedUpUserExample2();
    eventWithAllData = testHelpers.getEventWithAllData();
    event1 = testHelpers.getEventWithLocationExample1();
    event2 = testHelpers.getEventWithLocationExample2();
    profile = testHelpers.getProfile();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('creating signup works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    util.checkUserId.mockResolvedValue({status: 200});
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

    signupRepository.find.mockResolvedValue({
        rows: [{
            signUp,
        }],
    });

    profileRepo.updateKarmaPoints.mockResolvedValue({
        rows: [{
            profile,
        }],
    });

    const updateSignupResult = await eventSignupService.updateSignUp(signUp);

    expect(signupRepository.update).toHaveBeenCalledTimes(1);
    expect(updateSignupResult.status).toBe(200);
    expect(updateSignupResult.data.signup).toMatchObject({signUp});
});

test('status works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    signupRepository.find.mockResolvedValue({
        rows: [{
            signUp,
        }],
    });

    const signupResult = await eventSignupService.getSignupStatus(signUp);

    expect(signupRepository.find).toHaveBeenCalledTimes(1);
    expect(signupResult.status).toBe(200);
    expect(signupResult.data.signup).toMatchObject({signUp});
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
            {id: 4, date: yesterday},
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

test('getting events user is going to works and in the future', async () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    event1.date = tomorrow;
    event2.date = tomorrow;
    const eventsArray =[{
        ...eventWithAllData,
        eventid: 1,
        favourited: [ 1,4],
        volunteers:[15,69],
    },
    {
        ...eventWithAllData,
        eventid: 2,
        favourited: [15, 4],
        volunteers:[15,69],
    }];

    util.checkUser.mockResolvedValue({status: 200});
    individualRepository.findGoingEvents.mockResolvedValue({rows: eventsArray});
    eventSorter.sortByTimeAndDistance.mockResolvedValue(eventsArray);
    const getGoingEventsResult = await eventSignupService.getGoingEvents(15);

    expect(individualRepository.findGoingEvents).toHaveBeenCalledTimes(1);
    expect(getGoingEventsResult.status).toBe(200);
    expect(getGoingEventsResult.data.events).toMatchObject([
        {
            ...eventWithAllData,
            eventid: 1,
            favourited: false,
            going: true,
        },
        {
            ...eventWithAllData,
            eventid: 2,
            favourited: true,
            going: true,
        }
    ]);
});

test('getting all signups to event works', async () => {
    util.checkEventId.mockResolvedValue({
        status: 200,
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

test("creating signup to an event with invalid event id fails as expected", async () => {
    util.checkEventId.mockResolvedValue({status: 400, message: "invalid id"});
    expect(eventSignupService.createSignup({eventId: 69000})).rejects.toEqual(new Error("invalid id"));
});

test("creating signup to an event with invalid user id fails as expected", async () => {
    util.checkEventId.mockResolvedValue({status: 200});
    util.checkUserId.mockResolvedValue({status: 400, message: "invalid id"});
    expect(eventSignupService.createSignup({userId: 69000})).rejects.toEqual(new Error("invalid id"));
});

test("getting all signups to an event with invalid id fails as expected", async () => {
    util.checkEventId.mockResolvedValue({status: 400, message: "invalid id"});
    expect(eventSignupService.getAllSignupsForEvent({eventId: 69000})).rejects.toEqual(new Error("invalid id"));
});

test("getting all signed up events with invalid userId fails as expected", async () => {
    util.checkUser.mockResolvedValue({status: 400, message: "invalid id"});
    expect(eventSignupService.getGoingEvents({userId: 69000})).rejects.toEqual(new Error("invalid id"));
});

test('updating karma points for attended event works', async () => {
    util.checkEventId.mockResolvedValue({status: 200});

    const attendedSignUp = {
        individualId: -1,
        eventId: 3,
        confirmed: true,
        attended: true,
    };

    const unattendedSignup = signUp;

    signupRepository.update.mockResolvedValue({
        rows: [
            attendedSignUp,
        ],
    });

    signupRepository.find.mockResolvedValue({
        rows: [
            unattendedSignup,
        ],
    });

    profileRepo.updateKarmaPoints.mockResolvedValue({
        rows: [
            profile,
        ],
    });

    const updateSignupResult = await eventSignupService.updateSignUp(attendedSignUp);

    expect(signupRepository.update).toHaveBeenCalledTimes(1);
    expect(profileRepo.updateKarmaPoints).toHaveBeenCalledTimes(1);
    expect(updateSignupResult.status).toBe(200);
    expect(updateSignupResult.data.signup).toStrictEqual(attendedSignUp);
});
