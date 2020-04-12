import React from "react";
import {ActivityIndicator, Image} from "react-native";
import {getAuthToken} from "../util/credentials";
import AsyncStorage from "@react-native-community/async-storage";
import {REACT_APP_API_URL} from "react-native-dotenv";
import {initialiseApp} from "../util/initialise";
import Styles from "../styles/Styles";
import Colours from "../styles/Colours";
import {SafeAreaView} from "react-native-safe-area-context";
import RNBootSplash from "react-native-bootsplash";
const request = require("superagent");

export default class SplashScreen extends React.Component {
    async componentDidMount() {
        RNBootSplash.hide();
        await initialiseApp();
        const {navigate} = this.props.navigation;
        try {
            const isFullySignedUp = await AsyncStorage.getItem(
                "FULLY_SIGNED_UP",
            );
            if (isFullySignedUp) {
                const authToken = await getAuthToken();
                if (authToken !== "") {
                    const response = await request
                        .get(`${REACT_APP_API_URL}/authentication`)
                        .set("authorization", authToken);
                    if (response.status === 200) {
                        navigate("Main");
                        return;
                    }
                }
            }
            navigate("Auth");
        } catch (err) {
            console.log(err);
            navigate("Auth");
        }
    }
    render() {
        return (
            <SafeAreaView
                style={[
                    Styles.alignJustifyCenterContainer,
                    {backgroundColor: Colours.blue},
                ]}>
                <Image
                    style={{
                        width: 273,
                        height: 60,
                    }}
                    source={require("../assets/images/general-logos/KARMA-logo.png")}
                />
                <ActivityIndicator
                    size="large"
                    color="#ffffff"
                    style={[Styles.pt24, {position: "absolute", bottom: 16}]}
                />
            </SafeAreaView>
        );
    }
}
