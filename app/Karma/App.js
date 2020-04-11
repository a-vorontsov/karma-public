import React from "react";
import {createSwitchNavigator, createAppContainer} from "react-navigation";

import {SafeAreaProvider} from "react-native-safe-area-context";

import MainTabNavigator from "./src/routes/MainTabNavigator";
import AuthNavigator from "./src/routes/AuthNavigator";
import {MenuProvider} from "react-native-popup-menu";
import SplashScreen from "./src/views/SplashScreen";

const AppNavigator = createSwitchNavigator(
    {
        Splash: SplashScreen,
        Auth: AuthNavigator,
        Main: MainTabNavigator,
    },
    {
        initialRouteName: "Splash",
        backBehavior: "none",
    },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
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
