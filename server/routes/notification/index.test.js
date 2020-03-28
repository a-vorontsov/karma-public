const request = require('supertest');
const app = require('../../app');
const testHelpers = require("../../test/helpers");
const validation = require("../../modules/validation");
const notificationService = require("../../modules/notification");

jest.mock("../../modules/notification");
jest.mock("../../modules/validation");

let notification;

beforeEach(() => {
    process.env.NO_AUTH = 1;
    notification = testHelpers.getNotification();
});

afterEach(() => {
    return jest.clearAllMocks();
});

test('creating notification for multiple recipients works', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.createNotifications.mockResolvedValue({
        status: 200,
        message: "Notification created successfully.",
        data: notification,
    });
    notification.receiverIds = [1, 2, 3, 4];
    const response = await request(app).post("/notification").send(notification);
    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        message: "Notification created successfully.",
        data: notification,
    });
    expect(notificationService.createNotifications).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('creating notification for a single recipient works', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.createNotifications.mockResolvedValue({
        status: 200,
        message: "Notification created successfully.",
        data: notification,
    });
    notification.receiverId = 1;
    const response = await request(app).post("/notification").send(notification);
    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(response.body).toMatchObject({
        message: "Notification created successfully.",
        data: notification,
    });
    expect(notificationService.createNotifications).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('attempting to create a notification of an invalid format is rejected as expected', async () => {
    validation.validateNotification.mockReturnValue({errors: ["abc"]});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.createNotifications.mockResolvedValue({
        status: 200,
        message: "Notification created successfully.",
        data: notification,
    });
    notification.receiverId = 1;
    const response = await request(app).post("/notification").send(notification);
    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(response.body.message).toBe("Notification is not in right format");
    expect(response.statusCode).toBe(400);
});

test('creating notification for multiple recipients in case of a server error returns the error message as expected', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.createNotifications.mockImplementation(() => {
        throw new Error("Server error");
    });
    notification.receiverIds = [1, 2, 3, 4];
    const response = await request(app).post("/notification").send(notification);
    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(notificationService.createNotifications).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
});

test('creating notification for a single recipient in case of a server error returns the error message as expected', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.createNotifications.mockImplementation(() => {
        throw new Error("Server error");
    });
    notification.receiverId = 1;
    const response = await request(app).post("/notification").send(notification);
    expect(validation.validateNotification).toHaveBeenCalledTimes(1);
    expect(notificationService.createNotifications).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
    expect(response.body.message).toBe("Server error");
});

test('finding notifications works', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.getNotification.mockResolvedValue({
        status: 200,
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification],
        },
    });
    const response = await request(app).get("/notification").query({userId: 1}).send(notification);

    expect(response.body).toMatchObject({
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification],
        },
    });
    expect(notificationService.getNotification).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(200);
});

test('finding notifications for a user with invalid id fails as expected', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.getNotification.mockResolvedValue({
        status: 200,
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification],
        },
    });
    const response = await request(app).get("/notification").query({userId: "NaN"}).send(notification);

    expect(response.body.message).toBe("ID is not a number.");
    expect(notificationService.getNotification).toHaveBeenCalledTimes(0);
    expect(response.statusCode).toBe(400);
});

test('finding notifications in case of a server error returns error message as expected', async () => {
    validation.validateNotification.mockReturnValue({errors: ""});
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationService.getNotification.mockImplementation(() => {
        throw new Error("Server error");
    });
    const response = await request(app).get("/notification").query({userId: 1}).send(notification);

    expect(response.body.message).toBe("Server error");
    expect(notificationService.getNotification).toHaveBeenCalledTimes(1);
    expect(response.statusCode).toBe(500);
});
