import {Alert} from "react-native";
const request = require("superagent");

export const sendNotification = async (
    type,
    message = "",
    senderId,
    receiverIds,
) => {
    let options = {
        type: type,
        message: message,
        senderId: senderId,
        receiverIds: receiverIds,
    };

    await request
        .post("http://localhost:8000/notification/")
        .send(options)
        .then(res => {
            console.log(res.body.data);
        })
        .catch(err => {
            Alert.alert("Server Error", err.message);
        });
};
