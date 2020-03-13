import React, {Component} from "react";
import {
    View,
    TouchableOpacity,
    StatusBar,
    Platform,
    Image,
    KeyboardAvoidingView,
} from "react-native";
import {RegularText} from "../components/text";
import {EmailInput, PasswordInput, SignInCodeInput} from "../components/input";
import Styles from "../styles/Styles";
import WelcomeScreenStyles from "../styles/WelcomeScreenStyles";
import Colours from "../styles/Colours";
const request = require("superagent");

class WelcomeScreen extends Component {
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
            buttonText: "Sign Up/ Log In",
            codeSent:false,
        };
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colours.backgroundWhite);
        }
        this.checkPass = this.checkPass.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSignUpPressed = this.onSignUpPressed.bind(this);
        this.onForgotPassPressed = this.onForgotPassPressed.bind(this);
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

    onForgotPassPressed() {
        this.setState({isForgotPassPressed: true});
        // remove the password field
        this.setState({showPassField: false});
        //send 6 digit code to email through forgot password route

        //show code
        this.setState({showCode: true});
    }

    onSignUpPressed() {
        const {navigate} = this.props.navigation;
        if (this.state.emailInput === "") {
            this.setState({isSignUpPressed: true});
            //this.setState(this.baseState)
        } else {
            this.setState(this.baseState);
            //navigate("InitSignup");
        }
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    async onSubmitEmail(isValid) {
        const {navigate} = this.props.navigation;
        // email is of a valid format
        if (isValid) {
            console.log("here");
            await request
                .post("http://localhost:8000/signin/email")
                .send({
                    authToken: null,
                    userId: null,
                    data: {
                        email: this.state.emailInput,
                    },
                })
                .then(res => {
                    console.log("here1");
                    // console.log(res.status);
                     console.log(res.body);
                    if (res.body.data.isFullySignedUp) {
                        // returning user
                        //if user isFullySignedUp
                        console.log("here2");
                        console.log("Fully signed Up");
                        this.setState({
                            showPassField: true,
                            showCode: false,
                            showEmailError: false,
                            buttonText: "Log In",
                        });
                        return;
                    }
                    if (res.body.data.isSignedUp) {
                        console.log("here3");
                        console.log(" is signed Up");
                        //if user is SignedUp
                         navigate("InitSignup");
                         return;
                    }
                    if (res.body.data.isEmailVerified) {
                        console.log("here4");
                        console.log(" email is verified");
                        // if email is verified
                         navigate("UserSignUp");
                         return;
                    }
                    //if email is not verified
                    // show code field
                    console.log("here5");
                    console.log(" email is NOT verified");
                    this.setState({
                        showPassField: false,
                        showCode: true,
                        showEmailError: false,
                        buttonText: "Sign Up",
                    });
                    console.log("hereeeeeeeeeee");
                })
                .catch(err => {
                    console.log("BIG ERROR");
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
                .post("http://localhost:8000/signin/password")
                .send({
                    authToken: null,
                    userId: null,
                    data: {
                        email: this.state.emailInput,
                        password:this.state.passInput,
                    },
                })
                .then(res => {
                    // if password correct
                    console.log(res.status);
                    console.log(res.body);
                    this.setState({isValidPass: true});
                    console.log("correct pass");
                    navigate("PickCauses");
                    return;
                })
                .catch(err => {
                    console.log(err.message);
                    this.setState({isValidPass: false});
                    this.setState({showPassError: true});
                });
    }

    // verify code is correct
    async checkCode(code) {
        const {navigate} = this.props.navigation;
        if (this.state.isForgotPassPressed) {
            // check with forgotPassword route
            // code correct
            // if (code === "123456") {
            //     console.log("correct code");
            //     this.setState({isCodeValid: true});
            //     navigate('UserSignup');
            // } else {
            //     // code incorrect
            //     this.setState({isCodeValid: false});
            //     console.log("incorrect code");
            // }
        } else {
            //check with register route
            await request
                .post("http://localhost:8000/verify/email")
                .send({
                    authToken: null,
                    userId: null,
                    data: {
                        email: this.state.emailInput,
                        token: code,
                    },
                })
                .then(res => {
                    console.log(res.status);
                    console.log(res.body);
                    if(res.status === 200){
                        console.log("correct code");
                        this.setState({isCodeValid: true});
                        navigate("UserSignUp");
                    }
                    else{
                                        // code incorrect
                this.setState({isCodeValid: false});
                console.log("incorrect code");
                    }
                })
                .catch(err => {
                    console.log(err.message);
                });
        }
    }

    render() {
        return (
            <View style={WelcomeScreenStyles.container}>
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
                    <RegularText
                        style={[
                            WelcomeScreenStyles.text,
                            {fontSize: 40},
                        ]} /* // should be an image so that its moved as smoothly as the image PROBLEM */
                    >
                        lorem ipsum
                    </RegularText>
                </View>

                <KeyboardAvoidingView
                    style={{flex: 1}}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <View
                        style={{
                            flex: 1,
                            alignItems: "flex-start",
                            marginBottom: 40,
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
                                onForgotPassPressed={this.onForgotPassPressed}
                                showPassError={this.state.showPassError}
                            />
                        )}

                        {/* 6-Digit Code Field*/}
                        {this.state.showCode && (
                            <SignInCodeInput
                                onFulfill={this.checkCode}
                                text={
                                    this.state.isForgotPassPressed
                                        ? "Please enter the 6 digit code sent to your recovery email."
                                        : "Please enter your email verification code below."
                                }
                            />
                        )}
                    </View>
                </KeyboardAvoidingView>

                <View
                    style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 40,
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
            </View>
        );
    }
}

export default WelcomeScreen;
