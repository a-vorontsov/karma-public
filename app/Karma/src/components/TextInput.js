import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native";
import SignUpScreen from "../views/UserSignUpScreen";
import SignUpStyles from "../styles/SignUpStyles";

const {width} = Dimensions.get("window");
const formWidth = 0.8 * width;

class TInput extends Component {
    constructor(props) {
        super(props);
    }

    getInnerRef = () => this.ref;
    render() {
        const {name, text, onChange} = this.props;
        const defaultError = "This field is required";
        const inputStyle = this.props.showError
            ? [SignUpStyles.textInput, styles.errorMessage]
            : SignUpStyles.textInput;
        return (
            <View>
                <TextInput
                    style={[inputStyle, this.props.style]}
                    placeholder={this.props.placeholder}
                    autoCapitalize={this.props.autoCapitalize}
                    returnKeyType={
                        this.props.returnKeyType
                            ? this.props.returnKeyType
                            : "next"
                    }

                   
                    // multiline={this.props.multiline}
                    onChangeText={text => onChange({name, text})}
                    ref={this.props.inputRef}
                    onSubmitEditing={this.props.onSubmitEditing}
                    blurOnSubmit={false}
                    autoCorrect={false}
                    secureTextEntry={this.props.secureTextEntry}
                    editable={this.props.editable}
                />
                {this.props.showError ? (
                    <Text style={styles.errorText}>
                        {this.props.errorText !== undefined
                            ? this.props.errorText
                            : defaultError}
                    </Text>
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
