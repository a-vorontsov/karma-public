import React, {Component} from "react";
import {
    View,
    TouchableOpacity,
    StatusBar,
    Platform,
    Image,
    KeyboardAvoidingView,
    SafeAreaView,
} from "react-native";
import {RegularText} from "../components/text";
import {EmailInput, PasswordInput, SignInCodeInput} from "../components/input";
import Styles from "../styles/Styles";
import WelcomeScreenStyles from "../styles/WelcomeScreenStyles";
import Colours from "../styles/Colours";
import * as Keychain from "react-native-keychain";
import PageHeader from "../components/PageHeader";
import {TextInput} from "../components/input";
import ChangePasswordInput from "../components/input/ChangePasswordInput";

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state={
            email: this.props.navigation.getParam("email"),
            isFirstOpened: true,
        };
    }
        render(){
            return(<SafeAreaView>
                    <View>
                        <PageHeader title="Forgot Password" />
                        <RegularText>owo</RegularText>
                    </View>
                    <View>
                        <TextInput
                            placeholder={this.state.email}
                            autoCapitalize="none"
                            name="email"
                            onChange={this.onChangeText}
                            showError={false}
                            editable={false}
                        />
                        <ChangePasswordInput 
                        firstOpen={this.state.isFirstOpened}
                        />
                        <TouchableOpacity onPress={() => this.setState({isFirstOpened:false})}>
                        <RegularText>submit</RegularText>
                        </TouchableOpacity>
                    </View>
            </SafeAreaView>)
        }
}
