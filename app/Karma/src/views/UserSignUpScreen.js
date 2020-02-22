/* eslint-disable no-unused-vars */
import React from "react";
import {
    View,
    StyleSheet,
    Keyboard,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import CheckBox from "../components/CheckBox";
import {ScrollView} from "react-native-gesture-handler";
import TextInput from "../components/TextInput";
import PageHeader from "../components/PageHeader";
import {GradientButton} from "../components/buttons";
import {RegularText} from "../components/text";

import Styles from "../styles/Styles";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

class SignUpScreen extends React.Component {
    static navigationOptions = {
        headerShown: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            email: "team-team@gmail.com",
            username: "",
            password: "",
            confPassword: "",
            hidePassword: true,
            termsChecked: false,
            toolTipVisible: true,
            firstOpen: true,
        };
        this.onChangeText = this.onChangeText.bind(this);
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };

    isValidPassword = () => {
        return PASSWORD_REGEX.test(this.state.password);
    };

    signUserUp = () => {
        const {
            fname,
            lname,
            email,
            username,
            password,
            confPassword,
        } = this.state;
        this.setState({firstOpen: false});
        this.props.navigation.navigate("About");
    };

    render() {
        const showPasswordError =
            !this.state.password ||
            this.state.password !== this.state.confPassword ||
            !this.isValidPassword();
        const {navigate} = this.props.navigation;
        return (
            <KeyboardAvoidingView
                style={[Styles.container, Styles.ph24]}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                enabled>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <PageHeader title="Sign Up" />
                        <RegularText style={styles.subheaderText}>
                            Create a new account
                        </RegularText>

                        {/** form content **/}
                        <View style={Styles.bottom}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="First Name"
                                name="fname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.lname.focus()}
                                showError={
                                    this.state.firstOpen
                                        ? false
                                        : !this.state.fname
                                }
                            />

                            <TextInput
                                inputRef={ref => (this.lname = ref)}
                                placeholder="Last Name"
                                name="lname"
                                onChange={this.onChangeText}
                                onSubmitEditing={() => this.username.focus()}
                                showError={
                                    this.state.firstOpen
                                        ? false
                                        : !this.state.lname
                                }
                            />

                            <View>
                                <TextInput
                                    placeholder={this.state.email}
                                    autoCapitalize="none"
                                    name="email"
                                    onChange={this.onChangeText}
                                    showError={false}
                                    editable={false}
                                />
                                <RegularText style={Styles.textInputMiscText}>
                                    ✔️
                                </RegularText>
                            </View>

                            <TextInput
                                inputRef={ref => (this.username = ref)}
                                placeholder="Choose a username"
                                autoCapitalize="none"
                                onChange={this.onChangeText}
                                name="username"
                                onSubmitEditing={() => this.password.focus()}
                                showError={
                                    this.state.firstOpen
                                        ? false
                                        : !this.state.username
                                }
                            />
                            {/**
                             *  -- Password fields --
                             */}
                            <View>
                                <TextInput
                                    placeholder="Password"
                                    autoCapitalize="none"
                                    name="password"
                                    secureTextEntry={this.state.hidePassword}
                                    blurOnSubmit={false}
                                    onChange={this.onChangeText}
                                    showError={
                                        this.state.firstOpen
                                            ? false
                                            : !this.state.password ||
                                              this.state.password !==
                                                  this.state.confPassword
                                    }
                                    errorText={
                                        this.state.password !==
                                        this.state.confPassword
                                            ? ""
                                            : undefined
                                    }
                                    inputRef={ref => (this.password = ref)}
                                    onSubmitEditing={() =>
                                        this.confPassword.focus()
                                    }
                                    returnKeyType="next"
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            hidePassword: !this.state
                                                .hidePassword,
                                        })
                                    }
                                    style={Styles.textInputMiscText}>
                                    <RegularText style={Styles.cyan}>
                                        Show
                                    </RegularText>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Confirm Password"
                                    name="confPassword"
                                    autoCapitalize="none"
                                    blurOnSubmit={false}
                                    inputRef={ref => (this.confPassword = ref)}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    secureTextEntry={this.state.hidePassword}
                                    returnKeyType="default"
                                    onChange={this.onChangeText}
                                    showError={
                                        this.state.firstOpen
                                            ? false
                                            : showPasswordError
                                    }
                                    errorText={
                                        showPasswordError
                                            ? "Passwords must match"
                                            : null
                                    }
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        this.setState({
                                            hidePassword: !this.state
                                                .hidePassword,
                                        })
                                    }
                                    style={Styles.textInputMiscText}>
                                    <RegularText style={Styles.cyan}>
                                        Show
                                    </RegularText>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/**
                         * -- Footer --
                         * **/}
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
                                <RegularText
                                    style={[Styles.grey, {flexShrink: 1}]}>
                                    By creating an account, you agree to all the
                                    legal stuff:{" "}
                                    <RegularText
                                        style={Styles.link}
                                        onPress={() => navigate("Terms")}>
                                        Terms of Use
                                    </RegularText>
                                    {" & "}
                                    <RegularText
                                        style={Styles.link}
                                        onPress={() => navigate("Privacy")}>
                                        Privacy
                                    </RegularText>
                                </RegularText>
                            </View>
                            {!this.state.firstOpen &&
                            !this.state.termsChecked ? (
                                <RegularText style={[Styles.error, Styles.pb8]}>
                                    You must agree to the terms and conditions
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
        color: "#3bbfb2",
    },
    checkBox: {
        paddingRight: 16,
    },
});

export default SignUpScreen;
