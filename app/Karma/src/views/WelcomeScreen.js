import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    Text
} from "react-native";
import TextInput from "../components/TextInput";
import { RegularText, LogoText } from "../components/text";
import { TransparentButton, TextButton } from "../components/buttons";
import LinearGradient from "react-native-linear-gradient";
import Styles from "../styles/Styles";
import { SafeAreaView } from "react-native-safe-area-context";
import Colours from "../styles/Colours";

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isPressed: false,
            isRecognised: false,
            isVerified: false,
        };
        this.popUpLogin = this.popUpLogin.bind(this);
    }

    popUpLogin() {
        // const {isPressed, isRecognised, isVerified} = this.state;

        return (
            <TextInput placeholder="owo" autoFocus={true} />
        )

    }
    render() {
        const { navigate } = this.props.navigation;
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colours.backgroundWhite);
        }
        return (
            <View style={styles.container}>
                <View style={{ flex: 2, justifyContent: "center" }}>
                    <RegularText style={[styles.text, { fontSize: 70 }]}>
                        KARMA
                    </RegularText>
                    <RegularText style={[styles.text, { fontSize: 40 }]}>
                        lorem ipsum
                    </RegularText>
                    {this.state.isPressed ? this.popUpLogin() : null}
                </View>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 40,
                    }}>

                    <TouchableOpacity
                        style={[styles.button, { marginBottom: 20 }]}
                        onPress={() => this.setState({ isPressed: true })}>
                        <RegularText style={[styles.text, { fontSize: 20 }]}>
                            Sign Up
                        </RegularText>
                    </TouchableOpacity>

                    <TouchableOpacity >
                        <RegularText
                            style={[
                                Styles.white,
                                Styles.textCenter,
                                Styles.xxxlarge,
                            ]}>
                            lorem ipsum
                        </RegularText>
                    </View>

                    <View style={Styles.bottom}>
                        <View style={[Styles.ph24, Styles.pb24, Styles.pt8]}>
                            <TransparentButton
                                onPress={() => navigate("InitSignup")}
                                white
                                title="Sign Up"
                            />

                            <TextButton
                                title="Already have an account? Login"
                                styles={[
                                    Styles.white,
                                    Styles.medium,
                                    Styles.pt16,
                                ]}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export default WelcomeScreen;
