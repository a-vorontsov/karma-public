import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    Text,
    Image,
    KeyboardAvoidingView
} from "react-native";
import { RegularText } from "../components/text";
import TextInput from "../components/TextInput"
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
                <View style={{ flex: 2, justifyContent: "center", /*backgroundColor:"black" */ }}>
                    <Image
                        style={{ width: 273, height: 60, flexDirection: "column", justifyContent: "center" }}
                        source={require('../assets/images/general-logos/KARMA-logo.png')}
                    >
                    </Image>
                    <RegularText style={[styles.text, { fontSize: 40 }]} /* // should be an image so that its moved as smoothly as the image PROBLEM */>
                        lorem ipsum
                    </RegularText>
                </View>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <View style={{
                        flex: 1,
                        alignItems: "flex-start",
                        marginBottom: 40, /*backgroundColor:"red"*/
                    }}>
                        {this.state.isPressed ? this.popUpEmail() : null}
                    </View>
                </KeyboardAvoidingView>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 40
                    }}>
                    <TouchableOpacity
                        style={[styles.button, { marginBottom: 20 }]}
                        onPress={() => this.setState({ isPressed: true })}>
                        <RegularText style={[styles.text, { fontSize: 20 }]}>
                            Sign Up
                        </RegularText>
                    </TouchableOpacity>
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
