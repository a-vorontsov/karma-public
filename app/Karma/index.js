/**
 * @format
 */

import {AppRegistry, StatusBar, Platform} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";

AppRegistry.registerComponent(appName, () => {
    StatusBar.setBarStyle("dark-content");
    if (Platform.OS === "ios") {
        StatusBar.setBackgroundColor("#f8f8f8");
    }
    return App;
});
