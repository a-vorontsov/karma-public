import React, {Component} from "react";
import {SafeAreaView, View, Text} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import { RegularText } from "../../components/text";

class Attendees extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <RegularText>Attendees</RegularText>
            </SafeAreaView>
        );
    }
}

export default Attendees;