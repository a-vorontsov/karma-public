import React from "react";

import {TouchableOpacity} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";

export default class TransparentButton extends React.Component {
    render() {
        const {
            onPress,
            title,
            white,
            size,
            paddingHz,
            red,
            disabled,
        } = this.props;
        let buttonColour = {
            border: Styles.roundButtonTransparent,
            text: Styles.green,
        };
        if (white) {
            buttonColour = {
                border: Styles.roundButtonTransparentWhite,
                text: Styles.white,
            };
        }
        if (red) {
            buttonColour = {
                border: Styles.roundButtonTransparentRed,
                text: Styles.red,
            };
        }
        return (
            <TouchableOpacity
                style={[
                    Styles.roundButton,
                    buttonColour.border,
                    disabled ? Styles.disabledButton : null,
                ]}
                onPress={onPress}
                activeOpacity={0.9}
                disabled={disabled}>
                <RegularText
                    style={[
                        {fontSize: size, paddingHorizontal: paddingHz},
                        buttonColour.text,
                    ]}>
                    {title}
                </RegularText>
            </TouchableOpacity>
        );
    }
    static defaultProps = {
        size: 20,
        paddingHz: 0,
    };
}
