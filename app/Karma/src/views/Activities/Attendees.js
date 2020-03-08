import React, {Component} from "react";
import {SafeAreaView, View, Text} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import { RegularText } from "../../components/text";
import AttendeeButton from "../../components/activities/AttendeeButton";

class Attendees extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph16}>
                    <AttendeeButton user="Sten"></AttendeeButton>
                    <AttendeeButton user="Paul"></AttendeeButton>
                    <AttendeeButton user="Mariam"></AttendeeButton>
                    <AttendeeButton user="Usman"></AttendeeButton>
                </View>
            </SafeAreaView>
        );
    }
}

export default Attendees;