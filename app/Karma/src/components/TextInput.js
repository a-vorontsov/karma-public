import React, {Component} from "react";
import {TextInput, View, StyleSheet} from "react-native";
import {RegularText} from "./text";
import Styles from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";

class TInput extends Component {
    constructor(props) {
        super(props);
    }

    getInnerRef = () => this.ref;
    render() {
        const {name, onChange} = this.props;
        const defaultError = "This field is required";
        const inputStyle = this.props.showError
            ? [SignUpStyles.textInput, styles.errorMessage]
            : SignUpStyles.textInput;
        return (
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
                />
                {this.props.showError ? (
                    <RegularText style={Styles.error}>
                        {this.props.errorText !== undefined
                            ? this.props.errorText
                            : defaultError}
                    </RegularText>
                ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    errorMessage: {
        borderBottomColor: "#e81f10",
        marginBottom: 10,
    },
    errorText: {
        color: "#e81f10",
    },
});

export default TInput;
