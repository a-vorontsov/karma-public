import React from "react";

import {
    TouchableOpacity,
    Text
} from "react-native";

import Styles from "../../styles/Styles";

export default class Button extends React.Component {
    render() {
        const { onPress, title } = this.props;
        return (
            <TouchableOpacity
                style={Styles.roundButton}
                onPress={onPress}
                activeOpacity={0.9}>
                <Text style={{fontSize: 20, color: "white"}}>{title}</Text>
            </TouchableOpacity>
        );
    }
}
