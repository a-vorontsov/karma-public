import React, {Component} from "react";
import {SafeAreaView, View, Dimensions, Alert} from "react-native";
import {ScrollView} from "react-native-gesture-handler";
import PageHeader from "../../components/PageHeader";
import Styles from "../../styles/Styles";
import {TextInput} from "../../components/input";
import ChangePasswordInput from "../../components/input/ChangePasswordInput";
import {GradientButton} from "../../components/buttons";
import {SubTitleText} from "../../components/text";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

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
        console.log(this.state.valid);
        if (!this.state.valid) {
            return;
        }

        const authToken = await getAuthToken();
        await request
            .post(`${REACT_APP_API_URL}/profile/edit/password`)
            .set("authorization", authToken)
            .send({
                oldPassword: this.state.oldPasswordInput,
                newPassword: this.state.passwordInput,
                confirmPassword: this.state.passwordInput,
            })
            .then(res => {
                // password is of correct format
                Alert.alert(
                    "Successful password change",
                    "Please log in with your new password.",
                    [{text: "OK", onPress: () => navigate("WelcomeScreen")}],
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
            passwordInput: inputState.confirmPassword.confirmPassword,
            valid: inputState.valid,
        });
    };

    render() {
        return (
            <SafeAreaView style={[Styles.container]}>
                <View style={Styles.ph24}>
                    <PageHeader title="Change Password" />
                </View>

                <View style={{alignItems: "center", flex: 1, top: 20}}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="never">
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
                                onSubmitEditing={() => this.password.focus()}
                                secureTextEntry={true}
                            />
                            <SubTitleText
                                style={{justifyContent: "flex-start"}}>
                                Enter your new password:
                            </SubTitleText>

                            <ChangePasswordInput
                                inputRef={ref => (this.password = ref)}
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
