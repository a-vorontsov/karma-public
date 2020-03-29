import React from "react";
import {createSwitchNavigator, createAppContainer} from "react-navigation";

import {SafeAreaProvider} from "react-native-safe-area-context";

import MainTabNavigator from "./src/routes/MainTabNavigator";
import MainNavigator from "./src/routes/MainNavigator";
import {MenuProvider} from "react-native-popup-menu";
import {initialiseApp} from "./src/util/initialise";

const AppNavigator = createSwitchNavigator(
    {
        Splash: {
            getScreen: () => require("./src/views/Settings/SettingsMenuScreen").default,
        },
        Auth: MainNavigator,
        Main: MainTabNavigator,
    },
    {
        initialRouteName: "Splash",
    },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
    componentDidMount() {
        initialiseApp();
    }
    render() {
        return (
            <MenuProvider>
                <SafeAreaProvider>
                    <AppContainer />
                </SafeAreaProvider>
            </MenuProvider>
        );
    }
}
