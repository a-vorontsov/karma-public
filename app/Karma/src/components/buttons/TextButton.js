import React from "react";

import {TouchableOpacity} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";

export default class Button extends React.Component {
    render() {
        const {onPress, title} = this.props;
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                <RegularText
                    style={[
                        Styles.buttonText,
                        Styles.textCenter,
                        this.props.styles,
                    ]}>
                    {title}
                </RegularText>
            </TouchableOpacity>
        );
    }
}
