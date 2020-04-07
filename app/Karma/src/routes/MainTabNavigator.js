import React from "react";
import {Image} from "react-native";
import {createBottomTabNavigator} from "react-navigation-tabs";
import Colours from "../styles/Colours";

import NotificationsScreen from "../views/NotificationsScreen";
import PickCausesScreen from "../views/PickCausesScreen";

import ActivitiesNavigator from "./ActivitiesNavigator";
import ProfileNavigator from "./ProfileNavigator";

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
        initialRouteName: "Activities",
        resetOnBlur: true,
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
