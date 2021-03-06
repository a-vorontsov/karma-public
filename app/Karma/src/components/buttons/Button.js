import React from "react";

import {TouchableOpacity} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";

export default class Button extends React.Component {
    render() {
        const {onPress, title, size, paddingHz} = this.props;
        return (
            <TouchableOpacity
                style={Styles.roundButton}
                onPress={onPress}
                activeOpacity={0.9}>
                <RegularText
                    style={[
                        Styles.buttonText,
                        Styles.white,
                        {fontSize: size, paddingHorizontal: paddingHz},
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
