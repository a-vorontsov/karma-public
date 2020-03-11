import React, {Component} from "react";
import {SafeAreaView, View} from "react-native";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import AttendeeButton from "../../components/activities/AttendeeButton";

class Attendees extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph16}>
                    <AttendeeButton user="Sten" />
                    <AttendeeButton user="Paul" />
                    <AttendeeButton user="Mariam" />
                    <AttendeeButton user="Usman" />
                </View>
            </SafeAreaView>
        );
    }
}

export default Attendees;
