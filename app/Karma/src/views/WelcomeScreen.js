import React, {Component} from "react";
import {
    View,
    TouchableOpacity,
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
import AsyncStorage from "@react-native-community/async-storage";

import {getAuthToken} from "../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

const request = require("superagent");

/**
 * @class WelcomeScreen represents the first page a user sees
 * when they open the application for the first time.
 *
 * Contains the log-in screen and email code input for new users.
 */
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

    /**
     * Logic for a user pressing the Forgot Password button
     * Includes POST request to the server in order to
     * Send the user a validation code via email
     */
    async onForgotPassPressed() {
        this.setState({isForgotPassPressed: true});
        // remove the password field
        this.setState({showPassField: false});
        //send 6 digit code to email through forgot password route
        const authToken = await getAuthToken();
        await request
            .post(`${REACT_APP_API_URL}/signin/forgot`)
            .set("authorization", authToken)
            .send({
                data: {
                    email: this.state.emailInput,
                },
            })
            .then(res => {
                //show code
                this.setState({showCode: true});
            })
            .catch(err => {
                console.log(err);
            });
    }

    /**
     * Logic for a user pressing the LogIn/Signup button
     */
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

    /**
     * Logic for actions after a user submits an email
     * @param {*} isValid
     */
    async onSubmitEmail(isValid) {
        const {navigate} = this.props.navigation;
        // email is of a valid format
        if (isValid) {
            const authToken = await getAuthToken();
            await request
                .post(`${REACT_APP_API_URL}/signin/email`)
                .set("authorization", authToken)
                .send({
                    data: {
                        email: this.state.emailInput,
                    },
                })
                .then(async res => {
                    const isFullySignedUp = await AsyncStorage.getItem(
                        "FULLY_SIGNED_UP",
                    );
                    if (res.body.data.isFullySignedUp) {
                        //if user isFullySignedUp, returning user
                        await AsyncStorage.setItem("FULLY_SIGNED_UP", "1");
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
                    if (res.body.data.alreadyAuthenticated && isFullySignedUp) {
                        navigate("Main");
                        return;
                    }
                    if (!isFullySignedUp && authToken) {
                        navigate("InitSignup");
                        return;
                    }
                    //if email is not verified, show code field
                    this.setState({
                        showPassField: false,
                        showCode: true,
                        showEmailError: false,
                        buttonText: "Sign Up",
                    });

                    // if user requests code token several times
                    if (res.body.data.tokenAlreadyRequested) {
                        Alert.alert(
                            "Please wait " +
                                res.body.data.waitSeconds +
                                " seconds until requesting a new code.",
                        );
                    }
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

    /**
     * Verify password is correct
     */
    async checkPass() {
        const {navigate} = this.props.navigation;
        let authToken = await getAuthToken();
        await request
            .post(`${REACT_APP_API_URL}/signin/password`)
            .set("authorization", authToken)
            .send({
                data: {
                    email: this.state.emailInput,
                    password: this.state.passInput,
                },
            })
            .then(async res => {
                // if password correct
                this.setState({isValidPass: true});
                authToken = res.body.data.authToken;
                await AsyncStorage.setItem("ACCESS_TOKEN", authToken);
                navigate("Activities");
            })
            .catch(err => {
                this.setState({isValidPass: false, showPassError: true});
                console.log(err);
            });
    }

    /**
     * Validate that the forgot password code inputted matches the one sent to the user's email
     * @param {*} code
     */
    async confirmForgotPasswordCode(code) {
        const authToken = await getAuthToken();
        const {navigate} = this.props.navigation;
        await request
            .post(`${REACT_APP_API_URL}/signin/forgot/confirm`)
            .set("authorization", authToken)
            .send({
                data: {
                    email: this.state.emailInput,
                    token: code,
                },
            })
            .then(async res => {
                const authenticationToken = res.body.data.authToken;
                await AsyncStorage.setItem("ACCESS_TOKEN", authenticationToken);
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

    /**
     * Validate that the sign up code inputted matches the one sent to the user's email
     * @param {*} code
     */
    async confirmVerifyEmailCode(code) {
        const {navigate} = this.props.navigation;
        //check with register route
        const authToken = await getAuthToken();
        await request
            .post(`${REACT_APP_API_URL}/verify/email`)
            .set("authorization", authToken)
            .send({
                data: {
                    email: this.state.emailInput,
                    token: code,
                },
            })
            .then(res => {
                if (res.status === 200) {
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
                        keyboardShouldPersistTaps="never"
                        style={{flex: 1}}>
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

                            {/* Password Field*/}
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
