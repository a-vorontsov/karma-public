import React, {Component} from "react";
import {View, Keyboard, Dimensions, TouchableOpacity} from "react-native";
import {TextInput} from "../input";
import {RegularText} from "../text";
import Styles from "../../styles/Styles";
import {SafeAreaView} from "react-navigation";
import LinearGradient from "react-native-linear-gradient";
import Colours from "../../styles/Colours";

const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;
export default class ChangePasswordInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePassword: true,
            isSubmitted: false,
            showError: false,
            passwordMatch: true,
            password: "",
            confirmPassword: "",
        };
        this.onChangeText = this.onChangeText.bind(this);
        this.passUpState = this.passUpState.bind(this);
    }

    onChangeText(event) {
        const {name, text} = event;
        this.setState({[name]: text});
        //TODO: call passupstate here
    }

    passUpState() {
        const confirmPassword = this.state;
        if (confirmPassword) {
            this.props.onChange({
                confirmPassword,
                valid: true,
            });
        }
    }

    isValidPassword() {
        if (!PASSWORD_REGEX.test(this.state.password) || !this.state.password) {
            return false;
        } else {
            return true;
        }
    }

    showError() {
        const {firstOpen} = this.props;
        // it's the first time you open the page
        if (firstOpen) {
            return false;
        }
        // password is of an invalid format OR empty
        if (!this.isValidPassword()) {
            return true;
        }
        // passwords don't match
        if (this.state.password !== this.state.confirmPassword) {
            if (!this.state.isSubmitted) {
                this.setState({passwordMatch: false, isSubmitted: true});
            }
            return true;
        }
    }

    whichErrorText() {
        if (!this.state.passwordMatch) {
            return "Passwords must match";
        }
        if (!this.isValidPassword()) {
            return "Password is too weak";
        }
    }

    getInnerRef = () => this.ref; // allows focus

    render() {
        const showError = this.showError();
        return (
            <SafeAreaView style={{flex: 1}}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        flex: 0.4,
                    }}>
                    <TextInput
                        placeholder="Password"
                        autoCapitalize="none"
                        name="password"
                        secureTextEntry={this.state.hidePassword}
                        //blurOnSubmit={false}
                        onChange={this.onChangeText}
                        showError={showError}
                        errorText={this.whichErrorText()}
                        inputRef={ref => (this.password = ref)} // let other components know what the password field is defined as
                        onSubmitEditing={() => {
                            this.passUpState();
                            this.confirmPassword.focus();
                        }}
                        returnKeyType="next"
                    />
                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 20,
                            backgroundColor: "#f8f8f8",
                        }}
                        onPress={() =>
                            this.setState({
                                hidePassword: !this.state.hidePassword,
                            })
                        }>
                        <RegularText style={Styles.cyan}>Show</RegularText>
                    </TouchableOpacity>
                </View>

                <View>
                    <TextInput
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        autoCapitalize="none"
                        inputRef={ref => (this.confirmPassword = ref)}
                        onSubmitEditing={() => {
                            this.passUpState();
                            Keyboard.dismiss();
                        }}
                        secureTextEntry={this.state.hidePassword}
                        returnKeyType="default"
                        onChange={this.onChangeText}
                        onBlur={this.passUpState}
                        showError={showError}
                        errorText={this.whichErrorText()}
                    />

                    <TouchableOpacity
                        style={{
                            position: "absolute",
                            right: 0,
                            top: 20,
                            backgroundColor: "#f8f8f8",
                        }}
                        onPress={() =>
                            this.setState({
                                hidePassword: !this.state.hidePassword,
                            })
                        }>
                        <RegularText style={Styles.cyan}>Show</RegularText>
                    </TouchableOpacity>
                </View>

                <View style={{width: FORM_WIDTH, flex: 2}}>
                    <LinearGradient
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        colors={[Colours.blue, Colours.lightBlue]}
                        style={Styles.roundButton}
                        opacity={0.8}>
                        <RegularText
                            style={
                                ({flexWrap: "wrap"},
                                [Styles.white, Styles.small, Styles.textCenter])
                            }>
                            Passwords need at least: {"\n"}
                            Ten characters {"\n"}
                            One uppercase letter{"\n"}
                            One lowercase letter {"\n"}
                            One number {"\n"}
                            One special character
                        </RegularText>
                    </LinearGradient>
                </View>
            </SafeAreaView>
        );
    }
}
