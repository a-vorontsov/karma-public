import React, {Component} from "react";
import {View, Text} from "react-native";

class GuidelinesScreen extends Component {
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
                <Text>Community Guidelines</Text>
            </View>
        );
    }
}

export default GuidelinesScreen;