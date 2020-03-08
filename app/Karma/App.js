import React from "react";
import {createSwitchNavigator, createAppContainer} from "react-navigation";

import {SafeAreaProvider} from "react-native-safe-area-context";

import MainTabNavigator from "./src/routes/MainTabNavigator";
import MainNavigator from "./src/routes/MainNavigator";
import { MenuProvider } from 'react-native-popup-menu';

const AppNavigator = createSwitchNavigator(
    {
        Splash: {
<<<<<<< HEAD
<<<<<<< HEAD
            getScreen: () => require("./src/views/AboutScreen").default,
=======
            getScreen: () => require("./src/views/WelcomeScreen").default,
>>>>>>> 3f45f02924ec18a5abf9b5639e09570895592a8e
=======
            getScreen: () => require("./src/views/WelcomeScreen").default,
>>>>>>> 144651d45b755ed1c427157a73518dbdcc1dc813
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
