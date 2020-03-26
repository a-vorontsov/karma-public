const request = require("supertest");
const app = require("../../app");
const testHelpers = require("../../test/helpers");
const settingsService = require("../../modules/settings");

jest.mock("../../modules/settings");

let setting;

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NO_AUTH = 1;
    setting = testHelpers.getSetting();
});

afterEach(() => {
    jest.clearAllMocks();
});

test("settings fetching endpoint works", async () => {
    settingsService.getCurrentSettings.mockResolvedValue({
        status: 200,
        message: "Settings fetched successfully",
        data: {
            settings: setting,
        },
    });

    const response = await request(app)
        .get(`/settings?userId=${setting.userId}`);

    setting.userId = setting.userId.toString();
    expect(settingsService.getCurrentSettings).toHaveBeenCalledTimes(1);
    expect(settingsService.getCurrentSettings).toHaveBeenCalledWith(setting.userId);
    delete setting.userId;
    expect(response.body.data).toMatchObject({
        settings: setting,
    });
    expect(response.statusCode).toBe(200);
});

test("settings update works", async () => {
    settingsService.changeSettings.mockResolvedValue({
        status: 200,
        message: "Settings fetched successfully",
        data: {
            settings: setting,
        },
    });

    const response = await request(app)
        .post(`/settings`)
        .send(setting);

    expect(settingsService.changeSettings).toHaveBeenCalledTimes(1);
    expect(settingsService.changeSettings).toHaveBeenCalledWith(setting);
    delete setting.userId;
    expect(response.body.data).toMatchObject({
        settings: setting,
    });
    expect(response.statusCode).toBe(200);
});
