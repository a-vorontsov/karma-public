const testHelpers = require("../../../test/testHelpers");
const eventSignupService = require("./eventSignupService");

const signupRepository = require("../../../models/databaseRepositories/signupRepository");
const util = require("../../../util/util");

jest.mock("../../../models/databaseRepositories/signupRepository");
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

test('requesting event history works', async () => {
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


