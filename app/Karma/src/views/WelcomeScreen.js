import React, {Component} from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    Platform,
    Text
} from "react-native";
import {RegularText} from "../components/text";
import TextInput from "../components/TextInput"

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

        return(
        <TextInput placeholder="owo" autoFocus={true} />
        )
        
    }
    render() {
        const {navigate} = this.props.navigation;
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor("#f8f8f8");
        }
        return (
            <View style={styles.container}>
                <View style={{flex: 2, justifyContent: "center"}}>
                    <RegularText style={[styles.text, {fontSize: 70}]}>
                        KARMA
                    </RegularText>
                    <RegularText style={[styles.text, {fontSize: 40}]}>
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
                        style={[styles.button, {marginBottom: 20}]}
                        onPress={() => this.setState({isPressed: true})}>
                        <RegularText style={[styles.text, {fontSize: 20}]}>
                            Sign Up
                        </RegularText>
                    </TouchableOpacity>

                    <TouchableOpacity >
                        <RegularText
                            style={[
                                styles.text,
                                {fontSize: 15, fontWeight: "200"},
                            ]}>
                            Already have an account? Login
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
