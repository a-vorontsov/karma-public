import React from "react";

import {
    TouchableOpacity,
    Text
} from "react-native";

import Styles from "../../styles/Styles";

export default class TransparentButton extends React.Component {
    render() {
        const { onPress, title } = this.props;
        return (
            <TouchableOpacity
                style={[Styles.roundButton, Styles.roundButtonTransparent]}
                onPress={onPress}
                activeOpacity={0.9}>
                <Text style={[{fontSize: 20}, Styles.roundButtonTransparentText]}>{title}</Text>
            </TouchableOpacity>
        );
    }
}
