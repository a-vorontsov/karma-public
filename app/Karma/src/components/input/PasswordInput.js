import React from "react";;
import TextInput from "./TextInput";
import {RegularText} from "../text"
import {TouchableOpacity} from "react-native";
import WelcomeScreenStyles from "../../styles/WelcomeScreenStyles";
export default class PasswordInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            passInput: "",
        };
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
        this.props.onChange(name,text);
    };

    render() {
        return (
            <>
                {/* password field */}
                <TextInput
                    name="passInput"
                    placeholder="Please enter your password"
                    style={this.props.style}
                    secureTextEntry={true}
                    showError={this.props.showPassError}
                    errorText={"Please enter the correct password."}
                    autoFocus={true}
                    onChange={this.onChangeText}
                    onSubmitEditing={this.props.onSubmitEditing}
                />

                {/* forgot password button*/}
                <TouchableOpacity
                    style={[
                        {textAlign: "right", flex: 1, alignSelf: "flex-end"},
                    ]}
                    onPress={this.props.onForgotPassPressed}>
                    <RegularText
                        style={[WelcomeScreenStyles.text, {fontSize: 15}]}>
                        Forgot Password?
                    </RegularText>
                </TouchableOpacity>
            </>
        );
    }
}
