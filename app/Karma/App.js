import React from "react";
import {createSwitchNavigator, createAppContainer} from "react-navigation";

import {SafeAreaProvider} from "react-native-safe-area-context";

import MainTabNavigator from "./src/routes/MainTabNavigator";
import MainNavigator from "./src/routes/MainNavigator";
import {MenuProvider} from "react-native-popup-menu";

const AppNavigator = createSwitchNavigator(
    {
        Splash: {
            getScreen: () => require("./src/views/WelcomeScreen").default,
        },
        Auth: MainNavigator,
        Main: MainTabNavigator,
    },
    {
        initialRouteName: "Splash",
    },
);

const AppContainer = createAppContainer(AppNavigator);

export default function App() {
    return (
        <MenuProvider>
            <SafeAreaProvider>
                <AppContainer />
            </SafeAreaProvider>
        </MenuProvider>
    );
}
