import React, {Component} from "react";
import {KeyboardAvoidingView, StyleSheet, SafeAreaView} from "react-native";
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
            <SafeAreaView style={Styles.safeAreaContainer}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior="padding"
                    enabled>
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
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerText: {
        fontSize: 25,
        color: "black",
        paddingLeft: 20,
    },
    subheaderText: {
        fontSize: 25,
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 20,
        color: "#00A8A6",
    },
    smallHeaderText: {
        fontSize: 20,
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 10,
        color: "#00A8A6",
    },
    subText: {
        fontSize: 15,
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 0,
        paddingBottom: 10,
        color: "black",
    },
    nextButton: {
        height: 50,
        backgroundColor: "#00A8A6",
        paddingHorizontal: 30,
        marginTop: 40,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    uploadButton: {
        height: 50,
        width: 200,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D3D3D3",
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: 15,
        fontWeight: "400",
        color: "gray",
    },
    buttonTextSelected: {
        fontSize: 15,
        fontWeight: "400",
        color: "white",
    },
    genderContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
    },
    genderButton: {
        height: 40,
        width: 150,
        backgroundColor: "transparent",
        borderWidth: 2,
        borderColor: "#D3D3D3",
        marginRight: 20,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    genderButtonSelected: {
        height: 40,
        width: 150,
        backgroundColor: "#00A8A6",
        borderWidth: 2,
        borderColor: "#D3D3D3",
        marginRight: 20,
        marginTop: 15,
        marginBottom: 10,
        borderRadius: 30,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
export default SettingsMenuScreen;
