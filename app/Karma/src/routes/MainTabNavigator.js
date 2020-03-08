import React from "react";
import {Image} from "react-native";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import ActivitiesScreen from "../views/Activities/ActivitiesScreen";
import CauseAllActivitiesScreen from "../views/Activities/CauseAllActivitiesScreen";
import CreatedActivitiesScreen from "../views/Activities/CreatedActivitiesScreen";
import ActivityInfoScreen from "../views/Activities/ActivityInfoScreen";
import ActivityEditScreen from "../views/Activities/ActivityEditScreen";
import Attendees from "../views/Activities/Attendees";
import SignUpRequests from "../views/Activities/SignUpRequests";
import ViewSignUpsScreen from "../views/Activities/ViewSignUpsScreen";
import NotificationsScreen from "../views/NotificationsScreen";
import ProfileScreen from "../views/ProfileScreen";
import ProfileEditScreen from "../views/ProfileEditScreen";
import SettingsMenuScreen from "../views/Settings/SettingsMenuScreen";
import PrivacyScreen from "../views/Settings/PrivacyScreen";
import TermsScreen from "../views/Settings/TermsScreen";
import AboutKarmaScreen from "../views/Settings/AboutKarmaScreen";
import GuidelinesScreen from "../views/Settings/GuidelinesScreen";
import EmailSettingsScreen from "../views/Settings/EmailSettingsScreen";
import LogOutScreen from "../views/Settings/LogOutScreen";
import ReportProblemScreen from "../views/Settings/ReportProblemScreen";
import PickCausesScreen from "../views/PickCausesScreen";

const SettingsNavigator = createStackNavigator(
    {
        SettingsMenu: {screen: SettingsMenuScreen},
        ReportProblem: {screen: ReportProblemScreen},
        AboutKarma: {screen: AboutKarmaScreen},
        Guidelines: {screen: GuidelinesScreen},
        Privacy: {screen: PrivacyScreen},
        Terms: {screen: TermsScreen},
        EmailSettings: {screen: EmailSettingsScreen},
        LogOut: {screen: LogOutScreen},
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

const ProfileNavigator = createStackNavigator(
    {
        Profile: {screen: ProfileScreen},
        ProfileEdit: {screen: ProfileEditScreen},
        PickCauses: {screen: PickCausesScreen},
        SettingsMenu: {screen: SettingsMenuScreen},
        Settings: SettingsNavigator,
        CreatedActivities: {screen: CreatedActivitiesScreen},
        ActivityEdit: {screen: ActivityEditScreen},
        ViewSignUps: {screen: ViewSignUpsScreen},
        Attendees: {screen: Attendees},
        SignUpRequests: {screen: SignUpRequests},
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

const ActivitiesNavigator = createStackNavigator(
    {
        Activities: {screen: ActivitiesScreen},
        ActivityInfo: {screen: ActivityInfoScreen},
        CauseAll: {screen: CauseAllActivitiesScreen},
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

const MainTabNavigator = createBottomTabNavigator(
    {
        Activities: {
            screen: ActivitiesNavigator,
            navigationOptions: {
                tabBarLabel: "Activities",
                tabBarIcon: ({focused}) =>
                    focused ? (
                        <Image
                            source={require("../assets/images/nav-bar/activities-on.png")}
                            style={{aspectRatio: 0.75, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("../assets/images/nav-bar/activities-off.png")}
                            style={{aspectRatio: 0.75, resizeMode: "contain"}}
                        />
                    ),
            },
        },
        Causes: {
            screen: PickCausesScreen,
            navigationOptions: {
                tabBarLabel: "Causes",
                tabBarIcon: ({focused}) =>
                    focused ? (
                        <Image
                            source={require("../assets/images/nav-bar/causes-on.png")}
                            style={{aspectRatio: 0.7, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("../assets/images/nav-bar/causes-off.png")}
                            style={{aspectRatio: 0.7, resizeMode: "contain"}}
                        />
                    ),
            },
        },
        Notifications: {
            screen: NotificationsScreen,
            navigationOptions: {
                tabBarLabel: "Notifications",
                tabBarIcon: ({focused}) =>
                    focused ? (
                        <Image
                            source={require("../assets/images/nav-bar/notifications-on.png")}
                            style={{aspectRatio: 0.5, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("../assets/images/nav-bar/notifications-off.png")}
                            style={{aspectRatio: 0.5, resizeMode: "contain"}}
                        />
                    ),
            },
        },
        Profile: {
            screen: ProfileNavigator,
            navigationOptions: {
                tabBarLabel: "Profile",
                tabBarIcon: ({focused}) =>
                    focused ? (
                        <Image
                            source={require("../assets/images/nav-bar/profile-on.png")}
                            style={{aspectRatio: 0.6, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("../assets/images/nav-bar/profile-off.png")}
                            style={{aspectRatio: 0.6, resizeMode: "contain"}}
                        />
                    ),
            },
        },
    },
    {
        tabBarOptions: {
            showLabel: true,
            allowFontScaling: false,
            inactiveTintColor: Colours.green,
            activeTintColor: Colours.blue,
            labelStyle: {
                fontSize: 15,
                fontWeight: "500",
            },
            style: {
                borderTopColor: "transparent",
                borderTopWidth: 0,
                height: 80,
                backgroundColor: "white",
            },
        },
    },
);

export default MainTabNavigator;
