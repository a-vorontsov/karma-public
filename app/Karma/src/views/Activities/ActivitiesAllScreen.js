import React, {Component} from "react";
import {View, Text} from "react-native";

class ActivitiesAllScreen extends Component {
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
                <Text>All</Text>
            </View>
        );
    }
}

export default ActivitiesAllScreen ;