import React, {Component} from "react";
import {SafeAreaView, View, Text} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {RegularText} from "../../components/text";
import SignUpRequest from "../../components/activities/SignUpRequest";

class SignUpRequests extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph16}>
                    <SignUpRequest user="Petra" />
                    <SignUpRequest user="Fin" />
                    <SignUpRequest user="Houssam" />
                    <SignUpRequest user="Sasha" />
                    <SignUpRequest user="Daniel" />
                </View>
            </SafeAreaView>
        );
    }
}

export default SignUpRequests;
