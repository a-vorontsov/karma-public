/**
 * @module Notification
 */

const express = require("express");
const router = express.Router();
const notificationRepository = require("../../models/databaseRepositories/notificationRepository");
const validation = require("../../modules/validation");

/**
 * Endpoint called whenever a user sends a new notification.<br/>
 * URL example: POST http://localhost:8000/notification/
 * @param {Notification} req.body - Information regarding the notification containing the same properties as this example,
 * including user IDs:
 <pre>
 {
    "type": "Cancellation",
    "message": "This event is cancelled thanks",
    "senderId": 1,
    "receiverId": 2
 }
 </pre>
 * @returns
 *  status: 200, description: The notification object created with its id.<br/>
 *  status: 400, description: The notification object was not in the right format.
 *  status: 500, description: DB error
 *   <pre>
 {
    "message": "Notification created successfully.",
    "data": {
        "notification": {
            "id": 1,
            "type": "Cancel",
            "message": "This is a message.",
            "timestampSent": "2019-02-02 00:00:00"
            "senderId": 1,
            "receiverId": 2
        }
    }
 }
 </pre>
 *  @name Create new notification
 *  @function
 */
router.post("/", async (req, res) => {
    try {
        const notification = req.body;
        const validationResult = validation.validateNotification(notification);
        if (validationResult.errors.length !== 0) {
            res.status(400).send({
                message: "Notification is not in right format",
                errors: validationResult.errors,
            });
            return;
        }
        notification.timestampSent = new Date();
        const notificationResult = await notificationRepository.insert(notification);
        res.status(200).send({
            message: "Notification created successfully.",
            data: {
                notification: notificationResult.rows[0],
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({message: e.message});
    }
});

/**
 * Endpoint called whenever a user wants to see all current notifications for a UserId.<br/>
 * URL example: GET http://localhost:8000/notification?userId=6
 * @param {Number} req.query.userId - ID of user
 * @returns
 *  status: 200, description: An array of notification objects containing the userIds.<br/>
 *  status: 400, description: The userId is not an integer.
 *  status: 500, description: DB error
 *  {
    "message": "Notifications fetched successfully.",
    "data": {
        "notifications": {
            "notification": {
            "id": 1,
            "type": "Cancel",
            "message": "This is a message.",
            "timestampSent": "2019-02-02 00:00:00"
            "senderId": 1,
            "receiverId": 2
            }
        }
    }
 }
 *  @name Get notifications
 *  @function
 */
router.get("/", async (req, res) => {
    try {
        const id = req.query.userId;
        if (Number.isInteger(id)) {
            return res.status(400).send({message: "ID is not a number."});
        }

        const notificationResult = await notificationRepository.findByUserId(id);
        res.status(200).send({
            message: "Notifications fetched successfully.",
            data: {
                notifications: notificationResult.rows,
            },
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({message: e.message});
    }
});

module.exports = router;
