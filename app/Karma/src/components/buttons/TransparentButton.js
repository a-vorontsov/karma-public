import React from "react";

import {TouchableOpacity} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";

export default class TransparentButton extends React.Component {
    render() {
        const {onPress, title, white} = this.props;
        return (
            <TouchableOpacity
                style={[
                    Styles.roundButton,
                    white
                        ? Styles.roundButtonTransparentWhite
                        : Styles.roundButtonTransparent,
                ]}
                onPress={onPress}
                activeOpacity={0.9}>
                <RegularText
                    style={[
                        {fontSize: 20},
                        white ? Styles.white : Styles.green,
                    ]}>
                    {title}
                </RegularText>
            </TouchableOpacity>
        );
    }
}
