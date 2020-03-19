import React, {Component} from "react";
import {SafeAreaView, View} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import SettingsButton from "../../components/buttons/SettingsButton";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";

const icons = {
    email: require("../../assets/images/settings-logos/email.png"),
    guidelines: require("../../assets/images/settings-logos/guidelines.png"),
    logo: require("../../assets/images/settings-logos/K-logo.png"),
    logout: require("../../assets/images/settings-logos/logout.png"),
    privacy: require("../../assets/images/settings-logos/privacy.png"),
    report: require("../../assets/images/settings-logos/report-problem.png"),
    terms: require("../../assets/images/settings-logos/terms.png"),
    key: require("../../assets/images/settings-logos/key.png"),
};

class SettingsMenuScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        const {navigate} = this.props.navigation;
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Settings" />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={Styles.ph24}>
                        <SettingsButton
                            title="Report A Problem"
                            icon={icons.report}
                            onPress={() => navigate("ReportProblem")}
                        />
                        <SettingsButton
                            title="About KARMA"
                            icon={icons.logo}
                            onPress={() => navigate("AboutKarma")}
                        />
                        <SettingsButton
                            title="Community Guidelines"
                            icon={icons.guidelines}
                            onPress={() => navigate("Guidelines")}
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
                            onPress={() => navigate("EmailSettings")}
                        />
                        <SettingsButton
                            title="Change Password"
                            icon={icons.key}
                            onPress={() => navigate("ChangePassword")}
                        />
                        <SettingsButton
                            title="Log Out"
                            icon={icons.logout}
                            onPress={() => navigate("LogOut")}
                        />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default SettingsMenuScreen;
