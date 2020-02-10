import React from "react";

import {
    TouchableOpacity,
    Text
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Styles from "../../styles/Styles";

export default class GradientButton extends React.Component {
    render() {
        const { onPress, title } = this.props;
        return (
            <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={["#01a7a6", "#00c5c4"]} style={Styles.roundButton}>
                <TouchableOpacity
                    onPress={onPress}
                    activeOpacity={0.9}>
                    <Text style={{fontSize: 20, color: "white"}}>{title}</Text>
                </TouchableOpacity>
            </LinearGradient>
        );
    }
}
