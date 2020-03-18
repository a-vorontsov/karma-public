import {Alert} from "react-native";
const request = require("superagent");

export const sendNotification = async (type, message = "", userId) => {
    let options = {
        type: type,
        message: message,
        senderId: 2,
        receiverId: 1,
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
