import React, {Component} from "react";
import {View, Text} from "react-native";

class ActivitiesScreen extends Component {
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
                <Text>Activities</Text>
            </View>
        );
    }
}

export default ActivitiesScreen;