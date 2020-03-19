const request = require('supertest');
const app = require('../../app');
const testHelpers = require("../../test/testHelpers");
const validation = require("../../modules/validation");

const notificationRepository = require("../../models/databaseRepositories/notificationRepository");

jest.mock("../../models/databaseRepositories/notificationRepository");
jest.mock("../../modules/validation");
validation.validateNotification.mockReturnValue({errors: ""});

let notification;

beforeEach(() => {
    process.env.SKIP_AUTH_CHECKS_FOR_TESTING = 1;
    notification = testHelpers.getNotification();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test('creating notification works', async () => {
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationRepository.insert.mockResolvedValue({
        rows: [{
            ...notification,
            id: 1,
        }],
    });
    const response = await request(app).post("/notification").send(notification);

    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        message: "Notification created successfully.",
        data: {
            notification: notification
        }
    });
    expect(notificationRepository.insert).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('finding notifications works', async () => {
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationRepository.findByUserId.mockResolvedValue({
        rows: [{
            ...notification,
            id: 1,
        }],
    });
    const response = await request(app).get("/notification").query({userId: 1}).send(notification);

    expect(response.body).toMatchObject({
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification]
        }
    });
    expect(notificationRepository.findByUserId).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});
