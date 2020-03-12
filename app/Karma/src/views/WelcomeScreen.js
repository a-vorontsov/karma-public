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
import {TextInput, EmailInput} from "../components/input";
import Styles from "../styles/Styles";
import WelcomeScreenStyles from "../styles/WelcomeScreenStyles";
import CodeInput from "react-native-code-input";
import Colours from "../styles/Colours";
const validate = require("validate.js");

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignUpPressed: false,
            isForgotPassPressed: false,
            emailInput: "",
            passInput: "",
            emailSubmitted: false,
            showEmailError: false,
            showPassError: false,
            showPassField: false,
            showCode: false,
            isValidPass: false,
            isCodeValid: false,
        };
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colours.backgroundWhite);
        }
        // methods that use setState()

        this.checkEmail = this.checkEmail.bind(this);
        this.checkPass = this.checkPass.bind(this);
        this.popUpCode = this.popUpCode.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSignUpPressed = this.onSignUpPressed.bind(this);
        this.PasswordInput = this.PasswordInput.bind(this);
    }

    onInputChange = value => {
        this.setState({
            emailInput: value
        });
        console.log("I am Parent component. I got", value, "from my child.");
      };
    // display password field
    PasswordInput() {
        // if(showCode){
        //  this.setState({showCode:false})}
        return (
            <>
                {/* password field */}
                <TextInput
                    name="passInput"
                    placeholder="Please enter your password"
                    style={[WelcomeScreenStyles.text, Styles.formWidth]}
                    secureTextEntry={true}
                    showError={
                        this.state.showPassError && !this.state.isValidPass
                    }
                    errorText={"Please enter the correct password."}
                    autoFocus={true}
                    onChange={this.onChangeText}
                    onSubmitEditing={this.checkPass}
                />

                {/* forgot password button*/}
                <TouchableOpacity
                    style={[
                        {textAlign: "right", flex: 1, alignSelf: "flex-end"},
                    ]}
                    onPress={() => this.setState({isForgotPassPressed: true})}>
                    <RegularText
                        style={[WelcomeScreenStyles.text, {fontSize: 15}]}>
                        Forgot Password?
                    </RegularText>
                </TouchableOpacity>
            </>
        );
    }

    onSignUpPressed() {
        const {navigate} = this.props.navigation;
        this.state.emailInput === ""
            ? this.setState({isSignUpPressed: true})
            : navigate("InitSignup");
    }
    onSubmitEmail(isValid) {
        this.setState({emailSubmitted: true});
        this.checkEmail(isValid);
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    // check if email is of a valid format
    isValidEmail() {
        const invalidEmail = validate(
            {from: this.state.emailInput},
            emailConstraints,
        );
        // invalidEmail == undefined if email is correct
        return !invalidEmail;
    }

    // checks if email is in DB
    checkEmail(isValid) {

        // this.setState({emailSubmitted: false});
        // const isValidEmail = this.isValidEmail();
        // email is of a valid format
        if (isValid) {
            // returning user
            if (this.state.emailInput === "P@y.c") {
                this.setState({
                    showPassField: true,
                    showCode: false,
                    showEmailError: false,
                });
            }
            // new user
            else if (this.state.emailInput !== "P@y.c") {
                //send email code TO DO BACKEND
                // show code field

                this.setState({
                    showPassField: false,
                    showCode: true,
                    showEmailError: false,
                });
            }
        }
        // email is of invalid format
        else if (!isValid) {
            this.setState({
                showPassField: false,
                showCode: false,
                showEmailError: true,
            });
        }
    }


    // verify password is correct
    checkPass() {
        // if password correct
        if (this.state.passInput === "owo") {
            this.setState({isValidPass: true});
        } else {
            // password incorrect
            // show error message
            this.setState({isValidPass: false});
            this.setState({showPassError: true});
        }
    }

    getForgotPassword() {
        // remove the password field
        if (this.state.showPassField) {
            this.setState({showPassField: false});
        }
        // toggle show code field flag
        if (this.state.showCode) {
            this.setState({showCode: false});
        } else {
            // display code field
            return this.popUpCode();
        }
    }

    // display code field
    popUpCode() {
        console.log("popping up code");
        return (
            <CodeInput
                ref={ref => (this.codeInputRef2 = ref)}
                keyboardType="numeric"
                codeLength={6}
                autoFocus={false}
                inputPosition="center"
                size={50}
                onFulfill={code => this.checkCode(code)}
                containerStyle={{marginTop: 30}}
                codeInputStyle={{borderWidth: 1.5}}
            />
        );
    }

    // verify code is correct
    checkCode(code) {
        // code correct
        if (code === "123456") {
            console.log("yay!!!");
            this.setState({isCodeValid: true});
        } else {
            // code incorrect
            this.setState({isCodeValid: false});
            console.log(";////");
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
                        <EmailInput
                        onChange={this.onInputChange}
                        style={[WelcomeScreenStyles.text, Styles.formWidth]}
                        onSubmitEditing={this.onSubmitEmail}
                        showEmailError = {this.state.showEmailError}
                        />
                        {/*this.state.isSignUpPressed && */}
                        {this.state.showPassField && this.PasswordInput()}
                        {this.state.showCode ? this.popUpCode() : null}
                        {this.state.isForgotPassPressed
                            ? this.getForgotPassword()
                            : null}
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
                            Sign Up
                        </RegularText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default WelcomeScreen;

// for email verification
export const emailConstraints = {
    from: {
        // Email is required
        presence: true,
        email: true,
    },
};
