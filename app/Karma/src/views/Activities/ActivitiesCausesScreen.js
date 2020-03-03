import React, {Component} from "react";
import {View, Text} from "react-native";

class ActivitiesCausesScreen extends Component {
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
                <Text>By cause</Text>
            </View>
        );
    }
}

export default ActivitiesCausesScreen ;
