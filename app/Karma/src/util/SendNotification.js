import {Alert} from "react-native";
const request = require("superagent");

export const sendNotification = async (
    type,
    eventName,
    senderId,
    receiverIds,
) => {
    let options = {
        type: type,
        message: constructNotificationMessage(type, eventName),
        senderId: senderId,
        receiverIds: receiverIds,
    };

    await request
        .post("http://localhost:8000/notification/")
        .send(options)
        .catch(err => {
            Alert.alert("Server Error", err.message);
        });
};
("has sent you a message - check your inbox!");

const constructNotificationMessage = (type, eventName) => {
    let notificationMessage = "";
    switch (type) {
        case "Message":
            notificationMessage = "has sent you a message - check your inbox!";
            break;
        case "EventCancellation":
            notificationMessage = `Event named ${eventName} has been cancelled.`;
            break;
        case "EventUpdate":
            notificationMessage = `The activity named ${eventName} has been updated!`;
            break;
        case "AttendanceCancellation":
            notificationMessage = `Your attendance has been rejected for the event named ${eventName}.`;
            break;
        case "AttendanceConfirmation":
            notificationMessage = `Your attendance has been confirmed for the event named ${eventName}.`;
            break;
    }
    return notificationMessage;
};
