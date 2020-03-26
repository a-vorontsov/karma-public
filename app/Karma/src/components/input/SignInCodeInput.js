import React from "react";
import {RegularText} from "../text";
import {View} from "react-native";
import CodeInput from "react-native-code-input";

export default class SignInCodeInput extends React.Component {
    constructor(props) {
        super(props);
    }
    onFulfill = code => {
        this.props.onFulfill(code);
    };

    render() {
        return (
            <View>
                <RegularText style={{color: "white"}}>
                    {this.props.text}
                </RegularText>
                <CodeInput
                    ref={ref => (this.codeInputRef2 = ref)}
                    keyboardType="number-pad"
                    codeLength={6}
                    autoFocus={false}
                    inputPosition="center"
                    size={50}
                    onFulfill={code => this.onFulfill(code)}
                    containerStyle={{marginTop: 20}}
                    codeInputStyle={{borderWidth: 1.5}}
                />
            </View>
        );
    }
}
