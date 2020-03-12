import React from "react";
import {Keyboard} from "react-native";
import TextInput from "./TextInput";

export default class EmailInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailInput: "",
        };
    }

    // check if email is of a valid format
    isValidEmail() {
        const invalidEmail = validate(
            {from: this.state.emailInput},
            emailConstraints,
        );
        // invalidEmail == undefined if email is correct
        return !invalidEmail;
    }
    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
    };
    render() {
        const {onSubmitEditing} = this.props;
        return (
            <TextInput
                name="emailInput"
                placeholder="Please enter your email"
                autoFocus={true}
                style={[WelcomeScreenStyles.text, Styles.formWidth]}
                showError={this.state.showEmailError && !this.isValidEmail()}
                errorText={"Please enter a valid email."}
                onChange={this.onChangeText}
                onSubmitEditing={this.onSubmitEmail} // calls checkEmail function
            />
        );
    }
}
