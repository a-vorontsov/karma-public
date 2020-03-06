import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import WelcomeScreen from "../views/WelcomeScreen";
import InitSignUpScreen from "../views/InitSignupScreen";
import UserSignUpScreen from "../views/UserSignUpScreen";
import OrgSignUpScreen from "../views/OrgSignUpScreen";
import AboutScreen from "../views/AboutScreen";
import ContactInfoScreen from "../views/ContactInfoScreen";
import PrivacyScreen from "../views/Settings/PrivacyScreen";
import TermsScreen from "../views/Settings/TermsScreen";
import SettingsMenuScreen from "../views/Settings/SettingsMenuScreen";
import AboutKarmaScreen from "../views/Settings/AboutKarmaScreen";
import GuidelinesScreen from "../views/Settings/GuidelinesScreen";
import EmailSettingsScreen from "../views/Settings/EmailSettingsScreen";
import LogOutScreen from "../views/Settings/LogOutScreen";
import ReportProblemScreen from "../views/Settings/ReportProblemScreen";
import MainTabNavigator from "./MainTabNavigator";


const MainNavigator = createStackNavigator(
    {
        Welcome: {screen: WelcomeScreen},
        InitSignup: {screen: InitSignUpScreen},
        UserSignUp: {screen: UserSignUpScreen},
        OrgSignUp: {screen: OrgSignUpScreen},
        About: {screen: AboutScreen},
        ContactInfo: {screen: ContactInfoScreen},
        Tab: MainTabNavigator,
        Privacy: {screen: PrivacyScreen},
        Terms: {screen: TermsScreen},
        SettingsMenu: {screen: SettingsMenuScreen},
        PickCauses: {screen: PickCausesScreen},
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: Colours.backgroundWhite,
            },
        },
    },
);

MainNavigator.navigationOptions = ({navigation}) => {
    let tabBarVisible = true;
    return {
        tabBarVisible,
    };
};

export default MainNavigator;
