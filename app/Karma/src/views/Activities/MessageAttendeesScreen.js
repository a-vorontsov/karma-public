import React, {Component} from "react";
import {SafeAreaView, View, Text} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import { RegularText } from "../../components/text";
import AttendeeButton from "../../components/activities/AttendeeButton";

class MessageAttendeesScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph16}>
                    <Text>Message</Text>
                </View>
            </SafeAreaView>
        );
    }
}

export default MessageAttendeesScreen;