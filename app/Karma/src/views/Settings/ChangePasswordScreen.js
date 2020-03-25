import React, {Component} from "react";
import {SafeAreaView, View, Dimensions, Alert} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {TextInput} from "../../components/input";
import ChangePasswordInput from "../../components/input/ChangePasswordInput";
import {GradientButton} from "../../components/buttons";
import {SubTitleText} from "../../components/text";
import {getData} from "../../util/credentials";

const request = require("superagent");

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;

export default class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isFirstOpened: true,
            oldPasswordInput: "",
            passwordInput: "",
            oldPassMatch: false,
        };
    }
    onChange = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    sendNewPass = async () => {
        const {navigate} = this.props.navigation;
        this.setState({isFirstOpened: false});
        const credentials = await getData();
        await request
            .post("http://localhost:8000/profile/edit/password")
            .set("authorization", credentials.password)
            .send({
                oldPassword: this.state.oldPasswordInput,
                newPassword: this.state.passwordInput,
                confirmPassword: this.state.passwordInput,
            })
            .then(res => {
                // password is of correct format
                Alert.alert(
                    "Successful password change",
                    "You've successfully changed your password!",
                    [{text: "OK", onPress: () => navigate("SettingsMenu")}],
                );
            })
            .catch(err => {
                if (err.message === '{"message":"Incorrect old password."}') {
                    Alert.alert("Incorrect old password", "Please try again.", [
                        {text: "OK", onPress: () => null},
                    ]);
                }
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
                    <PageHeader title="Change Password" />
                </View>

                <View style={{alignItems: "center", flex: 1, top: 20}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always">
                        <View style={{flex: 1}}>
                            <SubTitleText
                                style={{
                                    textAlign: "left",
                                    alignSelf: "stretch",
                                }}>
                                Enter your old password:
                            </SubTitleText>
                            <TextInput
                                name="oldPasswordInput"
                                placeholder="Verify Old Password"
                                onChange={this.onChange}
                                secureTextEntry={true}
                            />
                            <SubTitleText
                                style={{justifyContent: "flex-start"}}>
                                Enter your new password:
                            </SubTitleText>

                            <ChangePasswordInput
                                onChange={this.onInputChange}
                                firstOpen={this.state.isFirstOpened}
                            />
                        </View>
                    </ScrollView>
                    <View
                        style={{
                            width: FORM_WIDTH,
                            justifyContent: "flex-end",
                            marginBottom: 40,
                        }}>
                        <GradientButton
                            onPress={() => this.sendNewPass()}
                            title="Change"
                        />
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}
