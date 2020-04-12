import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import WelcomeScreen from "../views/WelcomeScreen";
import InitSignUpScreen from "../views/InitSignupScreen";
import UserSignUpScreen from "../views/UserSignUpScreen";
import OrgSignUpScreen from "../views/OrgSignUpScreen";
import AboutScreen from "../views/AboutScreen";
import PickCausesScreen from "../views/PickCausesScreen";
import VerifyScreen from "../views/VerifyScreen";
import ForgotPasswordScreen from "../views/ForgotPasswordScreen";

const AuthNavigator = createStackNavigator(
    {
        Welcome: {
            screen: WelcomeScreen,
        },
        ForgotPassword: {
            screen: ForgotPasswordScreen,
        },
        InitSignup: {
            screen: InitSignUpScreen,
        },
        UserSignUp: {
            screen: UserSignUpScreen,
        },
        OrgSignUp: {
            screen: OrgSignUpScreen,
        },
        About: {
            screen: AboutScreen,
        },
        PickCauses: {
            screen: PickCausesScreen,
        },
        Verify: {
            screen: VerifyScreen,
        },
    },
    {
        initialRouteName: "Welcome",
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: Colours.backgroundWhite,
            },
            gestureEnabled: false,
        },
    },
);

export default AuthNavigator;
