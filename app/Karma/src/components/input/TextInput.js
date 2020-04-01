import React, {Component} from "react";
import {TextInput, View, Keyboard, TouchableWithoutFeedback} from "react-native";
import {RegularText} from "../text";
import Styles from "../../styles/Styles";
import SignUpStyles from "../../styles/SignUpStyles";

export default class TInput extends Component {
    constructor(props) {
        super(props);
    }

    getInnerRef = () => this.ref;
    render() {
        const {name, onChange} = this.props;
        const defaultError = "This field is required";
        const inputStyle = this.props.showError
            ? [SignUpStyles.textInput, SignUpStyles.errorMessage]
            : SignUpStyles.textInput;
        return (
            <TouchableWithoutFeedback onPressOut={Keyboard.dismiss()}>
            <View>
                <TextInput
                    pointerEvents={this.props.pointerEvents}
                    style={[inputStyle, this.props.style]}
                    placeholder={this.props.placeholder}
                    autoCapitalize={this.props.autoCapitalize}
                    autoCompleteType={this.props.autoCompleteType}
                    returnKeyType={
                        this.props.returnKeyType
                            ? this.props.returnKeyType
                            : "next"
                    }
                    keyboardType={this.props.keyboardType}
                    onFocus={this.props.onFocus}
                    multiline={this.props.multiline}
                    onChangeText={text => onChange({name, text})}
                    ref={this.props.inputRef}
                    onSubmitEditing={this.props.onSubmitEditing}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    onBlur={this.props.onBlur}
                    secureTextEntry={this.props.secureTextEntry}
                    editable={this.props.editable}
                    value={this.props.value}
                    textContentType={this.props.textContentType}
                />
                {this.props.showError ? (
                    <RegularText style={Styles.error}>
                        {this.props.errorText !== undefined
                            ? this.props.errorText
                            : defaultError}
                    </RegularText>
                ) : null}
            </View>
            </TouchableWithoutFeedback>
        );
    }
}
