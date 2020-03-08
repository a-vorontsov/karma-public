import React, {Component} from "react";
import {SafeAreaView} from "react-native";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";

class AboutKarmaScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <PageHeader title="About Karma" />
            </SafeAreaView>
        );
    }
}

export default AboutKarmaScreen;
