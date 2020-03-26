import React, {Component} from "react";
import {View, Dimensions, SafeAreaView, Alert} from "react-native";

import Styles from "../styles/Styles";

import PageHeader from "../components/PageHeader";
import {TextInput} from "../components/input";
import ChangePasswordInput from "../components/input/ChangePasswordInput";
import {GradientButton} from "../components/buttons";
import {getAuthToken} from "../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

const request = require("superagent");

const {width: SCREEN_WIDTH} = Dimensions.get("window");
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
        const authToken = await getAuthToken();
        await request
            .post(`${REACT_APP_API_URL}/reset`)
            .set("authorization", authToken)
            .send({
                data: {
                    password: this.state.passwordInput,
                },
            })
            .then(res => {
                Alert.alert(
                    "Successful password reset",
                    "You've successfully reset your password!",

                    [{text: "OK", onPress: () => navigate("Welcome")}],
                );
            })
            .catch(err => {
                Alert.alert(
                    "Unsuccessful password reset",
                    "We didn't manage to reset your password, please try again.",

                    [{text: "OK", onPress: () => navigate("Welcome")}],
                );
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
