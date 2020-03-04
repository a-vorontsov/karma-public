import React from "react";
import {Image} from "react-native";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import Colours from "../styles/Colours";

import ActivitiesScreen from "../views/ActivitiesScreen";
import CausesScreen from "../views/CausesScreen";
import NotificationsScreen from "../views/NotificationsScreen";
import ProfileScreen from "../views/ProfileScreen";
import ProfileEditScreen from "../views/ProfileEditScreen";
import SettingsMenuScreen from "../views/SettingsMenuScreen";
import CreateActivityScreen from "../views/CreateActivityScreen";


const ProfileNavigator = createStackNavigator(
    {
        Profile: {screen: ProfileScreen},
        ProfileEdit: {screen: ProfileEditScreen},
        SettingsMenu: {screen: SettingsMenuScreen},
        CreateActivity: {screen: CreateActivityScreen},
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
            screen: ActivitiesScreen,
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
            screen: CausesScreen,
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
