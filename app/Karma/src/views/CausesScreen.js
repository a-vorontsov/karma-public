import React, {Component} from "react";
import {View, Text} from "react-native";

class CausesScreen extends Component {
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
                <Text>Causes</Text>
            </View>
        );
    }
}

export default CausesScreen;