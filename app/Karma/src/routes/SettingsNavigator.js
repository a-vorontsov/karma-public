import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import ChangePasswordScreen from "../views/Settings/ChangePasswordScreen";
import ReportProblemScreen from "../views/Settings/ReportProblemScreen";
import AboutKarmaScreen from "../views/Settings/AboutKarmaScreen";
import GuidelinesScreen from "../views/Settings/GuidelinesScreen";
import EmailSettingsScreen from "../views/Settings/EmailSettingsScreen";
import LogOutScreen from "../views/Settings/LogOutScreen";
import SettingsMenuScreen from "../views/Settings/SettingsMenuScreen";
import DeleteAccountScreen from "../views/Settings/DeleteAccountScreen";
import PrivacyScreen from "../views/Settings/PrivacyScreen";
import TermsScreen from "../views/Settings/TermsScreen";

const SettingsNavigator = createStackNavigator(
    {
        SettingsMenu: {screen: SettingsMenuScreen},
        Privacy: {
            screen: PrivacyScreen,
        },
        Terms: {
            screen: TermsScreen,
        },
        ReportProblem: {
            screen: ReportProblemScreen,
        },
        AboutKarma: {
            screen: AboutKarmaScreen,
        },
        Guidelines: {
            screen: GuidelinesScreen,
        },
        EmailSettings: {
            screen: EmailSettingsScreen,
        },
        ChangePassword: {
            screen: ChangePasswordScreen,
        },
        LogOut: {
            screen: LogOutScreen,
        },
        DeleteAccount: {
            screen: DeleteAccountScreen,
        },
    },
    {
        initialRouteName: "SettingsMenu",
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: Colours.backgroundWhite,
            },
        },
    },
);

export default SettingsNavigator;
