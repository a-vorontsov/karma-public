import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import WelcomeScreen from "../views/WelcomeScreen";
import InitSignUpScreen from "../views/InitSignupScreen";
import UserSignUpScreen from "../views/UserSignUpScreen";
import OrgSignUpScreen from "../views/OrgSignUpScreen";
import AboutScreen from "../views/AboutScreen";
import ContactInfoScreen from "../views/ContactInfoScreen";
import PrivacyScreen from "../views/PrivacyScreen";
import TermsScreen from "../views/TermsScreen";
import SettingsMenuScreen from "../views/SettingsMenuScreen";
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
