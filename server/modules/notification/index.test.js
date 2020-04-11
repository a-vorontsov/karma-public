const testHelpers = require("../../test/helpers");
const notificationService = require("./");
const notificationRepository = require("../../repositories/notification");

jest.mock("../../repositories/notification");

let notification;

beforeEach(() => {
    jest.clearAllMocks();
    notification = testHelpers.getNotification();
    return testHelpers.clearDatabase();
});

afterEach(() => {
    jest.clearAllMocks();
    return testHelpers.clearDatabase();
});

test("creating new notification works", async () => {
    notificationRepository.insert.mockResolvedValue({
        rows: [{
            ...notification,
            ...notification,
            ...notification,
        }],
    });

    notification.receiverIds = [1, 2, 3];
    const notificationResult = await notificationService.createNotifications(notification);
    expect(notificationRepository.insert).toHaveBeenCalledTimes(3);
    expect(notificationResult.status).toBe(200);
});

test('finding notifications works', async () => {
    notification.timestampSent = notification.timestampSent.toDateString();
    notificationRepository.findByUserId.mockResolvedValue({
        rows: [{
            ...notification,
            id: 1,
        }],
    });

    const getNotifications = await notificationService.getNotification(1);

    expect(getNotifications).toMatchObject({
        message: "Notifications fetched successfully.",
        data: {
            notifications: [notification],
        },
    });
    expect(notificationRepository.findByUserId).toHaveBeenCalledTimes(1);
    expect(getNotifications.status).toBe(200);
});
