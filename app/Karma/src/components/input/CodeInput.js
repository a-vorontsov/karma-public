import React from "react";
import TextInput from "./TextInput";
import {RegularText} from "../text";
import {TouchableOpacity} from "react-native";
import WelcomeScreenStyles from "../../styles/WelcomeScreenStyles";

export default class CodeInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            codeInput: "",
        };
    }

    onChangeText = event => {
        const {name, text} = event;
        this.setState({[name]: text});
        this.props.onChange(name, text);
    };

    render() {
        return (
            <View>
                <RegularText style={Styles.pb24}>
                    {this.state.isForgotPassPressed
                        ? "Please enter the 6 digit code sent to your recovery email."
                        : "Please enter your email verification code below."}
                </RegularText>
                <CodeInput
                    ref={ref => (this.codeInputRef2 = ref)}
                    keyboardType="number-pad"
                    codeLength={6}
                    autoFocus={false}
                    inputPosition="center"
                    size={50}
                    onFulfill={code => this.checkCode(code)}
                    containerStyle={{marginTop: 30}}
                    codeInputStyle={{borderWidth: 1.5}}
                />
            </View>
        );
    }
}
