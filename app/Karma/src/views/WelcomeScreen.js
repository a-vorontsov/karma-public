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
        this.popUpEmail = this.popUpEmail.bind(this);
        this.popUpPassword = this.popUpPassword.bind(this);

    }

    onChangeText = event => {
        const { name, text } = event;
        this.setState({ [name]: text });
    };

    popUpEmail() {
        // const {isPressed, isRecognised, isVerified} = this.state;

        return (
            <TextInput placeholder="Please enter your email" autoFocus={true} onChange={this.onChangeText} style={[styles.text, this.props.styles]} />
        )
    }
    popUpPassword() {
        // const {isPressed, isRecognised, isVerified} = this.state;

        return (
            <TextInput placeholder="Please enter your password" autoFocus={true} />
        )
    }
    popUpCode() { }

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
                    {this.state.isPressed ? this.popUpEmail() : null}
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

                    {/* <TouchableOpacity >
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
                    </TouchableOpacity> */}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#03A8AE",
    },
    text: {
        justifyContent: "center",
        textAlign: "center",
        color: "white",
    },
    button: {
        alignItems: "center",
        backgroundColor: "transparent",
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 30,
        paddingHorizontal: 125,
        paddingVertical: 10,
    },
});

export default WelcomeScreen;
