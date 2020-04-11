const notificationRepository = require("../../repositories/notification");

/**
 * Creates notifications for each receiver in receiverId
 * @param {object} notification A valid notification with an array of receiver IDs
 * Fails if something goes wrong in db.
 */
const createNotifications = async (notification) => {
    notification.timestampSent = new Date();
    const receivers = notification.receiverIds;
    const notifications = (await Promise.all(receivers.map(receiverId => create(notification, receiverId)))).map(x => x.rows[0]);
    return ({
        status: 200,
        message: "Notification created successfully.",
        data: notifications,
    });
};

const create = async (notification, receiverId) => {
    notification.receiverId = receiverId;
    return await notificationRepository.insert(notification);
};

/**
 * Gets all notifications for userId
 * @param {Number} userId
 * Fails if database calls fail.
 */
const getNotification = async (userId) => {
    const notificationResult = await notificationRepository.findByUserId(userId);
    return ({
        status: 200,
        message: "Notifications fetched successfully.",
        data: {
            notifications: notificationResult.rows,
        },
    });
};

module.exports = {
    createNotifications,
    getNotification,
};
