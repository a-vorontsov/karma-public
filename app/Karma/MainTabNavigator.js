import React from "react";
import {Image} from "react-native";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import ActivitiesScreen from "./src/views/ActivitiesScreen";
import CausesScreen from "./src/views/CausesScreen";
import NotificationsScreen from "./src/views/NotificationsScreen";
import ProfileScreen from "./src/views/ProfileScreen";
import SettingsMenuScreen from "./src/views/SettingsMenuScreen";

const ProfileNavigator = createStackNavigator(
    {
        Profile: {screen: ProfileScreen},
        SettingsMenu: {screen: SettingsMenuScreen},
    },
    {
        headerMode: "none",
        defaultNavigationOptions: {
            cardStyle: {
                backgroundColor: "#f8f8f8",
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
                            source={require("./src/assets/images/nav-bar/activities-on.png")}
                            style={{aspectRatio: 0.75, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("./src/assets/images/nav-bar/activities-off.png")}
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
                            source={require("./src/assets/images/nav-bar/causes-on.png")}
                            style={{aspectRatio: 0.7, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("./src/assets/images/nav-bar/causes-off.png")}
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
                            source={require("./src/assets/images/nav-bar/notifications-on.png")}
                            style={{aspectRatio: 0.5, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("./src/assets/images/nav-bar/notifications-off.png")}
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
                            source={require("./src/assets/images/nav-bar/profile-on.png")}
                            style={{aspectRatio: 0.6, resizeMode: "contain"}}
                        />
                    ) : (
                        <Image
                            source={require("./src/assets/images/nav-bar/profile-off.png")}
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
            inactiveTintColor: "#00A58B",
            activeTintColor: "#01a7a6",
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
