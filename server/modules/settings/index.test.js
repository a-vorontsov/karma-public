const testHelpers = require("../../test/testHelpers");
const settingsService = require("./");
const settingsRepository = require("../../models/databaseRepositories/settingsRepository");

jest.mock("../../models/databaseRepositories/settingsRepository");
jest.mock("../../util/util");

let setting;

beforeEach(() => {
    jest.clearAllMocks();
    setting = testHelpers.getSetting();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("updating settings works", async () => {
    setting.userId = 1;
    settingsRepository.findByUserId.mockResolvedValue({
        rows: [{
            ...setting,
        }],
    });

    settingsRepository.update.mockResolvedValue({
        rows: [{
            ...setting,
        }],
    });

    const settingResult = await settingsService.changeSettings(setting);
    delete setting.userId;
    expect(settingsRepository.update).toHaveBeenCalledTimes(1);
    expect(settingsRepository.findByUserId).toHaveBeenCalledTimes(1);
    expect(settingResult.data.settings).toMatchObject({
        ...setting,
    });
    expect(settingResult.status).toBe(200);
});

test("fetching settings works", async () => {

    settingsRepository.findByUserId.mockResolvedValue({
        rows: [{
            ...setting,
        }],
    });

    const getSettingResult = await settingsService.getCurrentSettings(setting.userId);

    expect(settingsRepository.findByUserId).toHaveBeenCalledTimes(1);
    expect(settingsRepository.findByUserId).toHaveBeenCalledWith(setting.userId);
    delete setting.userId;
    expect(getSettingResult.data.settings).toMatchObject({
        ...setting,
    });
    expect(getSettingResult.status).toBe(200);
});