import React, {Component} from "react";
import {
    View,
    TouchableOpacity,
    StatusBar,
    Platform,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
    Alert,
} from "react-native";
import {RegularText} from "../components/text";
import {EmailInput, PasswordInput, SignInCodeInput} from "../components/input";
import {ScrollView} from "react-native-gesture-handler";
import Styles from "../styles/Styles";
import WelcomeScreenStyles from "../styles/WelcomeScreenStyles";
import Colours from "../styles/Colours";
import AsyncStorage from "@react-native-community/async-storage";
import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");

export default class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignUpPressed: false,
            isForgotPassPressed: false,
            emailInput: "",
            passInput: "",
            showEmailError: false,
            showPassError: false,
            showPassField: false,
            showCode: false,
            isCodeValid: false,
            buttonText: "Sign Up/Log In",
        };
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colours.backgroundWhite);
        }
        this.checkPass = this.checkPass.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSignUpPressed = this.onSignUpPressed.bind(this);
        this.onForgotPassPressed = this.onForgotPassPressed.bind(this);
        this.confirmForgotPasswordCode = this.confirmForgotPasswordCode.bind(
            this,
        );
        this.confirmVerifyEmailCode = this.confirmVerifyEmailCode.bind(this);
        this.baseState = this.state;
    }

    onInputChange = (name, value) => {
        this.setState({
            [name]: value,
            showCode: false,
            isForgotPassPressed: false,
            showPassError: false,
        });
    };

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    async onForgotPassPressed() {
        this.setState({isForgotPassPressed: true});
        // remove the password field
        this.setState({showPassField: false});
        //send 6 digit code to email through forgot password route
        await request
            .post(`${REACT_APP_API_URL}/signin/forgot`)
            .set("authorization", "")
            .send({
                data: {
                    email: this.state.emailInput,
                },
            })
            .then(res => {
                //show code
                console.log(res.body.message);
                this.setState({showCode: true});
            })
            .catch(err => {
                console.log(err);
            });
    }

    onSignUpPressed() {
        if (this.state.emailInput === "") {
            this.setState({isSignUpPressed: true});
            return;
        }
        if (this.isForgotPassPressed && this.state.showCode) {
            this.confirmForgotPasswordCode();
        } else if (this.showCode) {
            this.confirmVerifyEmailCode();
        } else if (this.state.showPassField) {
            this.checkPass();
        } else if (this.state.emailInput !== "") {
            this.onSubmitEmail(true);
        } else {
            this.setState(this.baseState);
        }
    }

    async onSubmitEmail(isValid) {
        const {navigate} = this.props.navigation;
        // email is of a valid format
        if (isValid) {
            await request
                .post(`${REACT_APP_API_URL}/signin/email`)
                .set("authorization", "")
                .send({
                    data: {
                        email: this.state.emailInput,
                    },
                })
                .then(res => {
                    if (res.body.data.isFullySignedUp) {
                        //if user isFullySignedUp, returning user
                        this.setState({
                            showPassField: true,
                            showCode: false,
                            showEmailError: false,
                            buttonText: "Log In",
                        });
                        return;
                    }
                    if (res.body.data.isSignedUp) {
                        //if user is SignedUp
                        navigate("InitSignup");
                        return;
                    }
                    if (res.body.data.isEmailVerified) {
                        // if email is verified
                        navigate("UserSignUp", {
                            email: this.state.emailInput,
                        });
                        return;
                    }
                    //if email is not verified, show code field
                    this.setState({
                        showPassField: false,
                        showCode: true,
                        showEmailError: false,
                        buttonText: "Sign Up",
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        } else {
            // email is of invalid format
            this.setState({
                showPassField: false,
                showCode: false,
                showEmailError: true,
            });
        }
    }

    // verify password is correct
    async checkPass() {
        const {navigate} = this.props.navigation;
        await request
            .post(`${REACT_APP_API_URL}/signin/password`)
            .set("authorization", "")
            .send({
                data: {
                    email: this.state.emailInput,
                    password: this.state.passInput,
                },
            })
            .then(async res => {
                // if password correct
                this.setState({isValidPass: true});
                const authToken = res.body.data.authToken;
                await AsyncStorage.setItem("ACCESS_TOKEN", authToken);
                navigate("PickCauses");
            })
            .catch(err => {
                this.setState({isValidPass: false, showPassError: true});
                console.log(err);
            });
    }

    async confirmForgotPasswordCode(code) {
        const {navigate} = this.props.navigation;
        await request
            .post(`${REACT_APP_API_URL}/signin/forgot/confirm`)
            .set("authorization", "")
            .send({
                data: {
                    email: this.state.emailInput,
                    token: code,
                },
            })
            .then(async res => {
                const authToken = res.body.data.authToken;
                await AsyncStorage.setItem("ACCESS_TOKEN", authToken);
                console.log("in welcome screen");

                console.log("correct code");

                console.log(res.body.message);

                this.setState({isCodeValid: true});
                navigate("ForgotPassword", {
                    email: this.state.emailInput,
                });
            })
            .catch(err => {
                // code incorrect
                console.log(err);
                this.setState({isCodeValid: false});
                Alert.alert("Incorrect code", "Please try again.", [
                    {text: "OK", onPress: () => null},
                ]);
            });
    }

    async confirmVerifyEmailCode(code) {
        const {navigate} = this.props.navigation;
        //check with register route
        await request
            .post(`${REACT_APP_API_URL}/verify/email`)
            .set("authorization", "")
            .send({
                data: {
                    email: this.state.emailInput,
                    token: code,
                },
            })
            .then(res => {
                console.log(res.status);
                console.log(res.body);
                if (res.status === 200) {
                    console.log("correct code");
                    this.setState({isCodeValid: true});
                    navigate("UserSignUp", {
                        email: this.state.emailInput,
                    });
                }
            })
            .catch(err => {
                // code incorrect
                console.log(err);
                this.setState({isCodeValid: false});
                Alert.alert("Incorrect code", "Please try again.", [
                    {text: "OK", onPress: () => null},
                ]);
            });
    }

    render() {
        return (
            <SafeAreaView style={WelcomeScreenStyles.container}>
                <View style={{flex: 2, justifyContent: "center"}}>
                    <Image
                        style={{
                            width: 273,
                            height: 60,
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                        source={require("../assets/images/general-logos/KARMA-logo.png")}
                    />
                </View>

                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always">
                        <View
                            style={{
                                flex: 1,
                                alignItems: "flex-start",
                            }}>
                            {/* Email Field*/}
                            {this.state.isSignUpPressed && (
                                <EmailInput
                                    onChange={this.onInputChange}
                                    style={[
                                        WelcomeScreenStyles.text,
                                        Styles.formWidth,
                                    ]}
                                    onSubmitEditing={this.onSubmitEmail}
                                    showEmailError={this.state.showEmailError}
                                />
                            )}

                            {/* Passowrd Field*/}
                            {this.state.showPassField && (
                                <PasswordInput
                                    style={[
                                        WelcomeScreenStyles.text,
                                        Styles.formWidth,
                                    ]}
                                    onChange={this.onInputChange}
                                    onSubmitEditing={this.checkPass}
                                    onForgotPassPressed={
                                        this.onForgotPassPressed
                                    }
                                    showPassError={this.state.showPassError}
                                />
                            )}

                            {/* 6-Digit Code Field*/}
                            {this.state.showCode && (
                                <SignInCodeInput
                                    onFulfill={
                                        this.state.isForgotPassPressed
                                            ? this.confirmForgotPasswordCode
                                            : this.confirmVerifyEmailCode
                                    }
                                    text={
                                        this.state.isForgotPassPressed
                                            ? "Please enter the 6 digit code sent to your email."
                                            : "Please enter your email verification code below."
                                    }
                                />
                            )}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                    }}>
                    <TouchableOpacity
                        style={[WelcomeScreenStyles.button, {marginBottom: 20}]}
                        onPress={this.onSignUpPressed}>
                        <RegularText
                            style={[WelcomeScreenStyles.text, {fontSize: 20}]}>
                            {this.state.buttonText}
                        </RegularText>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}
