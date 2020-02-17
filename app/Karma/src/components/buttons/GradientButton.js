import React from "react";

import {TouchableOpacity} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";

export default class GradientButton extends React.Component {
    render() {
        const {onPress, title} = this.props;
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={["#01a7a6", "#00c5c4"]}
                    style={Styles.roundButton}>
                    <RegularText
                        style={{
                            fontSize: 20,
                            justifyContent: "center",
                            textAlign: "center",
                            color: "white",
                        }}>
                        {title}
                    </RegularText>
                </LinearGradient>
            </TouchableOpacity>
        );
    }
}
