import React, {Component} from "react";
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native";

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
            ? [styles.textInput, styles.errorMessage]
            : styles.textInput;
        return (
            <View>
                <TextInput
                    style={inputStyle}
                    placeholder={this.props.placeholder}
                    autoCapitalize={this.props.autoCapitalize}
                    returnKeyType={
                        this.props.returnKeyType
                            ? this.props.returnKeyType
                            : "next"
                    }
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
    textInput: {
        width: formWidth,
        height: 45,
        borderColor: "transparent",
        borderBottomColor: "#D3D3D3",
        borderWidth: 1.5,
        marginTop: 5,
        marginBottom: 20,
        fontSize: 20,
        lineHeight: 20,
        color: "#7F7F7F",
        fontFamily: "Arial",
    },
    errorMessage: {
        borderBottomColor: "#e81f10",
        marginBottom: 10,
    },
    errorText: {
        color: "#e81f10",
    },
});

export default TInput;
