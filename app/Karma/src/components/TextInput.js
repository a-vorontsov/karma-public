import React, {Component} from "react";
import {TextInput, View} from "react-native";
import {RegularText} from "./text";
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
                    value={this.props.value}
                    style={inputStyle}
                    placeholder={this.props.placeholder}
                    autoCapitalize={this.props.autoCapitalize}
                    autoCompleteType={this.props.autoCompleteType}
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
                    onBlur={this.props.onBlur}
                    secureTextEntry={this.props.secureTextEntry}
                    editable={this.props.editable}
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

export default TInput;
