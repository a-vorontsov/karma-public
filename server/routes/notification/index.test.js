const request = require('supertest');
const app = require('../../app');
const testHelpers = require("../../test/testHelpers");
const validation = require("../../modules/validation");
const notificationService = require("../../modules/notification");

jest.mock("../../modules/notification");
jest.mock("../../modules/validation");
validation.validateNotification.mockReturnValue({errors: ""});

let notification;

beforeEach(() => {
    notification = testHelpers.getNotification();
});

afterEach(() => {
    return jest.clearAllMocks();
});

test('creating notification works', async () => {
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.createNotifications.mockResolvedValue({
        status: 200,
        message: "Notification created successfully.",
        data: notification,
    });
    notification.receiverIds = [1,2,3,4];
    const response = await request(app).post("/notification").send(notification);
    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        message: "Notification created successfully.",
        data: notification,
    });
    expect(notificationService.createNotifications).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('finding notifications works', async () => {
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.getNotification.mockResolvedValue({
        status: 200,
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification],
        }
    });
    const response = await request(app).get("/notification").query({userId: 1}).send(notification);

    expect(response.body).toMatchObject({
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification]
        }
    });
    expect(notificationService.getNotification).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});
