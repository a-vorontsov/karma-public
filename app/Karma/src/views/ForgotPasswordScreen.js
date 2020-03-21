import React, {Component} from "react";
import {View, Dimensions, SafeAreaView, Alert} from "react-native";

import Styles from "../styles/Styles";

import PageHeader from "../components/PageHeader";
import {TextInput} from "../components/input";
import ChangePasswordInput from "../components/input/ChangePasswordInput";
import {GradientButton} from "../components/buttons";
import { getData } from "../util/credentials";

const request = require("superagent");

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.navigation.getParam("email"),
            isFirstOpened: true,
            passwordInput: "",
        };
    }

    sendNewPass = async () => {
        const {navigate} = this.props.navigation;
        this.setState({isFirstOpened: false});
        const credentials = await getData();
        await request
            .post("http://localhost:8000/reset")
            .send({
                userId: credentials.username,
                authToken: credentials.password,
                data: {
                    password: this.state.passwordInput
                }
            })
            .then(res => {
                    Alert.alert("Successful password reset", "You've successfully reset your password!", [
                        {text: "OK", onPress: () => navigate("Welcome")},
                    ]);
            })
            .catch(err => {
                console.log(err);
            });
    };

    onInputChange = inputState => {
        this.setState({
            passwordInput: inputState.confPassword.confPassword,
        });
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container, Styles.ph24]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Forgot Password" />
                </View>

                <View style={{alignItems: "center", flex: 1, top: 20}}>
                    <View style={{flex: 1}}>
                        <TextInput
                            placeholder={this.state.email}
                            autoCapitalize="none"
                            name="email"
                            onChange={this.onChangeText}
                            showError={false}
                            editable={false}
                        />
                        <ChangePasswordInput
                            onChange={this.onInputChange}
                            firstOpen={this.state.isFirstOpened}
                        />
                    </View>
                    <View
                        style={{
                            width: FORM_WIDTH,
                            justifyContent: "flex-end",
                            marginBottom: 40,
                        }}>
                        <GradientButton
                            onPress={() => this.sendNewPass()}
                            title="Submit"
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
