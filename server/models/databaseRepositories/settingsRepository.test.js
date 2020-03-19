const userRepository = require("./userRepository");
const settingRepository = require("./settingsRepository");
const testHelpers = require("../../test/testHelpers");
const registrationRepository = require("./registrationRepository");

let registrationExample1, userExample1, settingExample;

beforeEach(() => {
    registrationExample1 = testHelpers.getRegistrationExample1();
    userExample1 = testHelpers.getUserExample1();
    settingExample = testHelpers.getSetting();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    return testHelpers.clearDatabase();
});

test('insert setting and findByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    settingExample.userId = insertUserResult.rows[0].id;
    const insertSettingResult = await settingRepository.insert(settingExample);
    const findSettingResultByUserId = await settingRepository.findByUserId(insertUserResult.rows[0].id);

    expect(insertSettingResult.rows[0]).toMatchObject(findSettingResultByUserId.rows[0]);
    expect(settingExample).toMatchObject(findSettingResultByUserId.rows[0]);
});

test('insert setting and deleteByUserId work', async () => {
    const insertRegistrationRepository = await registrationRepository.insert(registrationExample1);
    userExample1.email = insertRegistrationRepository.rows[0].email;
    const insertUserResult = await userRepository.insert(userExample1);

    settingExample.userId = insertUserResult.rows[0].id;
    await settingRepository.insert(settingExample);
    await settingRepository.removeByUserId(settingExample.userId);
    const findSettingResultByUserId = await settingRepository.findByUserId(insertUserResult.rows[0].id);

    expect(findSettingResultByUserId.rowCount).toBe(0);
});