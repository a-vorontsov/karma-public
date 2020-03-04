import React from "react";
import {TouchableOpacity} from "react-native";
import {RegularText} from "../text";

import RadioButtonStyles from "../../styles/RadioButtonStyles";

export default class RadioButton extends React.Component {
    constructor(props) {
        super(props);
        this.onValue = this.onValue.bind(this);
    }

    onValue(event) {
        this.props.onValue(event);
    }

    render() {
        const {value, title, selected} = this.props;
        return (
            <TouchableOpacity
                style={
                    selected
                        ? [
                              RadioButtonStyles.button,
                              RadioButtonStyles.buttonSelected,
                          ]
                        : RadioButtonStyles.button
                }
                onPress={() => this.onValue(value)}>
                <RegularText
                    style={
                        selected
                            ? [
                                  RadioButtonStyles.buttonText,
                                  RadioButtonStyles.buttonTextSelected,
                              ]
                            : RadioButtonStyles.buttonText
                    }>
                    {title}
                </RegularText>
            </TouchableOpacity>
        );
    }
}
