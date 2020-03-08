import React, {Component} from "react";
import {SafeAreaView, Text} from "react-native";
import Styles from "../../styles/Styles";

class PrivacyScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <Text>Privacy</Text>
            </SafeAreaView>
        );
    }
}

export default PrivacyScreen;
