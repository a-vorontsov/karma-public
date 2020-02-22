import React, {Component} from "react";
import {Text, TextInput, View} from "react-native";
import Styles from "../styles/Styles";

class TInput extends Component {
    constructor(props) {
        super(props);
    }

    getInnerRef = () => this.ref;
    render() {
        const {name, onChange} = this.props;
        const defaultError = "This field is required";
        const inputStyle = this.props.showError
            ? [Styles.textInput, Styles.textInputError]
            : Styles.textInput;
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
                    <Text style={Styles.error}>
                        {this.props.errorText !== undefined
                            ? this.props.errorText
                            : defaultError}
                    </Text>
                ) : null}
            </View>
        );
    }
}

export default TInput;
