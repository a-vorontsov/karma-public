import React, {Component} from "react";
import {View, Text} from "react-native";

class NotificationsScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                <Text>Notifications</Text>
            </View>
        );
    }
}

export default NotificationsScreen;
