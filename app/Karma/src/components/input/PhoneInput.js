import React from "react";
import {Keyboard} from "react-native";
import TextInput from "./TextInput";

export default class PhoneInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
        this.onChange = this.onChange.bind(this);
    }
    onChange(event) {
        const {text} = event;
        this.setState({
            value: text,
        });
        if (text) {
            this.props.onChange(text);
        }
    }
    render() {
        const {value} = this.state;
        return (
            <TextInput
                placeholder="Phone number"
                keyboardType="number-pad"
                onChange={this.onChange}
                value={value}
                onSubmitEditing={() => {
                    Keyboard.dismiss();
                }}
                showError={value === ""}
            />
        );
    }
}
