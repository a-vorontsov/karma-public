import React, {Component} from "react";
import {View, Text} from "react-native";

class ActivitiesGoingScreen extends Component {
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
                <Text>By faves</Text>
            </View>
        );
    }
}

export default ActivitiesGoingScreen;