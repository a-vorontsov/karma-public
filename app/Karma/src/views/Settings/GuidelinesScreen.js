import React, {Component} from "react";
import {SafeAreaView, View, Text} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";

class GuidelinesScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <PageHeader title="Community Guidelines" />
            </SafeAreaView>
        );
    }
}

export default GuidelinesScreen;
