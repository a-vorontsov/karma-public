import React from "react";
import {View, StyleSheet, KeyboardAvoidingView, Platform} from "react-native";
import CheckBox from "../components/CheckBox";
import {ScrollView} from "react-native-gesture-handler";
import {TextInput} from "../components/input";
import PageHeader from "../components/PageHeader";
import {GradientButton} from "../components/buttons";
import {RegularText, SubTitleText} from "../components/text";
import Colours from "../styles/Colours";
import Styles, {normalise} from "../styles/Styles";
import {SafeAreaView} from "react-native-safe-area-context";
import AsyncStorage from "@react-native-community/async-storage";
import {getAuthToken} from "../util/credentials";
import ChangePasswordInput from "../components/input/ChangePasswordInput";

import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.password = React.createRef();
        this.state = {
            email: this.props.navigation.getParam("email"),
            username: "",
            password: "",
            confPassword: "",
            termsChecked: false,
            toolTipVisible: true,
            firstOpen: true,
            sendPassUpState: false,
        };
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    onInputChange = inputState => {
        this.setState({
            password: inputState.password,
            confPassword: inputState.confirmPassword,
            valid: inputState.valid,
            sendPassUpState: false,
            showError: inputState.showError,
        });
    };

    createUser() {
        return {
            email: this.state.email,
            username: this.state.username,
            password: this.state.confPassword,
        };
    }
    signUserUp = async () => {
        const user = this.createUser();

        this.setState({firstOpen: false, sendPassUpState: true});

        if (
            !this.state.termsChecked ||
            !this.state.email ||
            !this.state.username ||
            !this.state.password ||
            !this.state.confPassword ||
            this.state.password !== this.state.confPassword ||
            !this.state.valid ||
            this.state.showError
        ) {
            return;
        }

        let authToken = await getAuthToken();
        if (authToken !== "") {
            this.props.navigation.navigate("InitSignup");
            return;
        }
        await request
            .post(`${REACT_APP_API_URL}/signup/user`)
            .set("authorization", authToken)
            .send({
                data: {
                    user: {...user},
                },
            })
            .then(async res => {
                authToken = res.body.data.authToken;
                await AsyncStorage.setItem("ACCESS_TOKEN", authToken);
                this.props.navigation.replace("InitSignup");
            })
            .catch(err => {
                console.log(err.message);
            });
    };

    render() {
        const {navigation} = this.props;

        return (
            <SafeAreaView
                style={{
                    ...Styles.con,
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}>
                <KeyboardAvoidingView
                    style={Styles.ph24}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="never">
                        <View>
                            <PageHeader title="Sign Up" disableBack={true} />
                            <SubTitleText style={{fontSize: normalise(26)}}>
                                Create a new account
                            </SubTitleText>

                            {/** form content **/}
                            <View>
                                <View>
                                    <TextInput
                                        placeholder={this.state.email}
                                        autoCapitalize="none"
                                        name="email"
                                        onChange={this.onChangeText}
                                        showError={false}
                                        editable={false}
                                    />
                                    <RegularText
                                        style={Styles.textInputMiscText}>
                                        ✔️
                                    </RegularText>
                                </View>

                                <TextInput
                                    inputRef={ref => (this.username = ref)}
                                    placeholder="Choose a username"
                                    autoCapitalize="none"
                                    onChange={this.onChangeText}
                                    name="username"
                                    onSubmitEditing={() =>
                                        this.password.focus()
                                    }
                                    showError={
                                        this.state.firstOpen
                                            ? false
                                            : !this.state.username
                                    }
                                />
                                {/**
                                 *  -- Password fields -- */}

                                <View>
                                    <ChangePasswordInput
                                        inputRef={ref => (this.password = ref)}
                                        onChange={this.onInputChange}
                                        firstOpen={this.state.firstOpen}
                                        sendPassUpState={
                                            this.state.sendPassUpState
                                        }
                                    />
                                </View>
                            </View>
                            {/**
                             * -- Footer -- * **/}
                            <View style={[Styles.pv24, Styles.bottom]}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        paddingBottom: 16,
                                    }}>
                                    <CheckBox
                                        style={styles.checkBox}
                                        onPressIn={() =>
                                            this.setState({
                                                termsChecked: !this.state
                                                    .termsChecked,
                                            })
                                        }
                                    />
                                    {/* RegularText block causes problems with horizontal display - it it not centered */}
                                    <RegularText
                                        style={[Styles.grey, {flexShrink: 1}]}>
                                        By creating an account, you agree to all
                                        the legal stuff:{" "}
                                        <RegularText
                                            style={Styles.link}
                                            onPress={() =>
                                                navigation.push("Terms")
                                            }>
                                            Terms of Use
                                        </RegularText>
                                        {" & "}
                                        <RegularText
                                            style={Styles.link}
                                            onPress={() =>
                                                navigation.push("Privacy")
                                            }>
                                            Privacy
                                        </RegularText>
                                    </RegularText>
                                </View>
                                {!this.state.firstOpen &&
                                !this.state.termsChecked ? (
                                    <RegularText
                                        style={[Styles.error, Styles.pb8]}>
                                        You must agree to the terms and
                                        conditions
                                    </RegularText>
                                ) : null}
                                <GradientButton
                                    onPress={this.signUserUp}
                                    title="Next"
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    subheaderText: {
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: "Arial",
        textAlignVertical: "top",
        textAlign: "left",
        paddingTop: 20,
        paddingBottom: 25,
        color: Colours.blue,
    },
    checkBox: {
        paddingRight: 16,
    },
});

export default SignUpScreen;
