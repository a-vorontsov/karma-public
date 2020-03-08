import React, { Component } from "react";
import {
    View,
    TouchableOpacity,
    StatusBar,
    Platform,
    Text,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    SegmentedControlIOSComponent
} from "react-native";
import { RegularText } from "../components/text";
import TextInput from "../components/TextInput"
import Styles from "../styles/Styles";
import WelcomeScreenStyles from "../styles/WelcomeScreenStyles";

var validate = require("validate.js");
class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSignUpPressed: false,
            isForgotPassPressed: false,
            isRecognised: false,
            isVerified: false,
            emailInput:"",
            passInput:"",
            emailSubmitted: false,
            showEmailError: false,
            showPassError: false,
            showPassField: false,
            showCode: false,
            isValidPass: false,

        };
        this.popUpEmail = this.popUpEmail.bind(this);
        this.popUpPassword = this.popUpPassword.bind(this);
        this.checkPass = this.checkPass.bind(this);
        this.popUpCode = this.popUpCode.bind(this);

    }
    onChangeText = event => {
        const { name, text } = event;
        this.setState({ [name]: text });
    };

     popUpEmail() {
        return (
            <TextInput name="emailInput" 
                placeholder="Please enter your email" 
                autoFocus={true} 
                style={[WelcomeScreenStyles.text, Styles.formWidth]} 
                showError={this.state.showEmailError && !this.isValidEmail()} 
                errorText={"Please enter a valid email."} 
                onChange={this.onChangeText} 
                onSubmitEditing={() => {this.setState({emailSubmitted: true}); this.checkEmail}} 
                
                />
        );
    }

    isValidEmail(){
        const invalidEmail = validate({from: this.state.emailInput}, emailConstraints)
        return !invalidEmail
    }

    checkEmail(){
        this.setState({emailSubmitted:false})
            const isValidEmail = this.isValidEmail()
           if(isValidEmail){
               if(this.state.emailInput=="P@y.c" ){ // old user
                
                    this.setState({showPassField:true, showCode:false, showEmailError:false})
               }
               else if(this.state.emailInput !="P@y.c"){ // new user
                   //send email code

                    this.setState({showPassField:false, showCode:true, showEmailError:false})
               }
           }
           else if(!isValidEmail){ // wrong email
                this.setState({showPassField:false, showCode:false, showEmailError:true})
           }
    }

    popUpPassword() { // to change ur password option visible always
        return (
            <>
            {/* password field */}
            <TextInput name="passInput" 
                placeholder="Please enter your password" 
                style={[WelcomeScreenStyles.text, Styles.formWidth]} 
                secureTextEntry={true} 
                showError={this.state.showPassError && !this.state.isValidPass} 
                errorText={"Please enter the correct password."}  
                autoFocus={true} 
                onChange={this.onChangeText}
                onSubmitEditing= {this.checkPass}/>

                {/* forgot password button*/}
            <TouchableOpacity style={[{textAlign:"right", flex:1, alignSelf:"flex-end"}]}
                            onPress={() => this.setState({ isForgotPassPressed: true })}>
                <RegularText style={[WelcomeScreenStyles.text, { fontSize: 15}]}>
                    Forgot Password?
                </RegularText>
            </TouchableOpacity>
            </>
        )
    }

    checkPass(){
        if(this.state.passInput === "owo"){
            this.setState({isValidPass:true})
        }
        else{
            this.setState({isValidPass:false})
            this.setState({showPassError:true})
           }
        }
    
    getForgotPassword(){
            console.log("ooooo");
        }

    popUpCode() {        
        return(<RegularText>here be code</RegularText>)
    }

    render() {
        const { navigate } = this.props.navigation;
        StatusBar.setBarStyle("dark-content");
        if (Platform.OS === "android") {
            StatusBar.setBackgroundColor(Colours.backgroundWhite);
        }
        return (
            <View style={WelcomeScreenStyles.container}>
                <View style={{ flex: 2, justifyContent: "center",}}>
                    <Image
                        style={{ width: 273, height: 60, flexDirection: "column", justifyContent: "center" }}
                        source={require('../assets/images/general-logos/KARMA-logo.png')}
                    >
                    </Image>
                    <RegularText style={[WelcomeScreenStyles.text, { fontSize: 40 }]} /* // should be an image so that its moved as smoothly as the image PROBLEM */>
                        lorem ipsum
                    </RegularText>
                </View>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}>
                    <View style={{
                        flex: 1,
                        alignItems: "flex-start",
                        marginBottom: 40,
                    }}>
                        {this.state.isSignUpPressed ? this.popUpEmail() : null}
                        {this.state.emailSubmitted ? this.checkEmail() : null}
                        {this.state.showPassField ? this.popUpPassword() : null}
                        {this.state.showCode ? this.popUpCode() : null}
                        {this.state.isForgotPassPressed ? this.getForgotPassword() : null}

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
                        style={[WelcomeScreenStyles.button, { marginBottom: 20 }]}
                        onPress={() => this.setState({ isSignUpPressed: true })}>
                        <RegularText style={[WelcomeScreenStyles.text, { fontSize: 20 }]}>
                            Sign Up
                        </RegularText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default WelcomeScreen;


export const emailConstraints = {
    from: {
        // Email is required
        presence: true,
        email: true
      },
};