import React, {Component} from "react";
import {SafeAreaView} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import SettingsButton from "../components/buttons/SettingsButton";
import PageHeader from "../components/PageHeader";
import Styles from "../styles/Styles";

const icons = {
    email: require("../assets/images/settings-logos/email.png"),
    guidelines: require("../assets/images/settings-logos/guidelines.png"),
    logo: require("../assets/images/settings-logos/K-logo.png"),
    logout: require("../assets/images/settings-logos/logout.png"),
    privacy: require("../assets/images/settings-logos/privacy.png"),
    report: require("../assets/images/settings-logos/report-problem.png"),
    terms: require("../assets/images/settings-logos/terms.png"),
};

class SettingsMenuScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <PageHeader title="Settings" />
                    <SettingsButton
                        title="Report A Problem"
                        icon={icons.report}
                        onPress={() => navigate("Activities")}
                    />
                    <SettingsButton
                        title="About KARMA"
                        icon={icons.logo}
                        onPress={() => navigate("Activities")}
                    />
                    <SettingsButton
                        title="Community Guidelines"
                        icon={icons.guidelines}
                        onPress={() => navigate("Activities")}
                    />
                    <SettingsButton
                        title="Privacy Policy"
                        icon={icons.privacy}
                        onPress={() => navigate("Privacy")}
                    />
                    <SettingsButton
                        title="Terms of Use"
                        icon={icons.terms}
                        onPress={() => navigate("Terms")}
                    />
                    <SettingsButton
                        title="Emails Settings"
                        icon={icons.email}
                        onPress={() => navigate("Activities")}
                    />
                    <SettingsButton
                        title="Log Out"
                        icon={icons.logout}
                        onPress={() => navigate("Activities")}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default SettingsMenuScreen;
