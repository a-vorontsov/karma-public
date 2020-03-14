import React from "react";
import {
    View,
    StyleSheet,
    Keyboard,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import CheckBox from "../components/CheckBox";
import {ScrollView} from "react-native-gesture-handler";
import {TextInput} from "../components/input";
import PageHeader from "../components/PageHeader";
import {GradientButton} from "../components/buttons";
import {RegularText, SubTitleText} from "../components/text";
import Colours from "../styles/Colours";
import Styles, {normalise} from "../styles/Styles";
import {SafeAreaView} from "react-native-safe-area-context";
const request = require("superagent");
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

class SignUpScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: this.props.navigation.getParam('email'),
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

    createUser() {
        const user = {
            email: this.state.email,
            username: this.state.username,
            password: this.state.password,
            confirmPassword: this.state.confPassword,
        };
        return user;
    }
    signUserUp = async () => {
        const user = this.createUser();
        await request
            .post("http://localhost:8000/signup/user")
            .send({
                authToken: null,
                userId: null,
                data: {
                    user: {...user},
                },
            })
            .then(res => {
                console.log(res.status);
                console.log(res.body);
                this.setState({firstOpen: false});
                this.props.navigation.navigate("InitSignup");
            })
            .catch(err => {
                console.log(err.message);
                Alert.alert("Server Error", err.message);
            });
    };

    render() {
        const {
            navigation: {navigate},
        } = this.props;
        const showPasswordError =
            !this.state.password ||
            this.state.password !== this.state.confPassword ||
            !this.isValidPassword();
        return (
            <SafeAreaView style={Styles.container}>
                <KeyboardAvoidingView
                    style={Styles.ph24}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    enabled>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="always">
                        <View>
                            <PageHeader title="Sign Up" />
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
                                 *  -- Password fields --
                                 */}
                                <View>
                                    <TextInput
                                        placeholder="Password"
                                        autoCapitalize="none"
                                        name="password"
                                        secureTextEntry={
                                            this.state.hidePassword
                                        }
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
                                        inputRef={ref =>
                                            (this.confPassword = ref)
                                        }
                                        onSubmitEditing={() =>
                                            Keyboard.dismiss()
                                        }
                                        secureTextEntry={
                                            this.state.hidePassword
                                        }
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
                                        By creating an account, you agree to all
                                        the legal stuff:{" "}
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
