import React, {Component} from "react";
import {View, Text} from "react-native";

class AboutKarmaScreen extends Component {
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
                <Text>About Karma</Text>
            </View>
        );
    }
}

export default AboutKarmaScreen;