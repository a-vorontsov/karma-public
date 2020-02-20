import React from "react";

import {Dimensions, TouchableOpacity} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import Styles from "../../styles/Styles";
import { RegularText } from "../text";
import Colours from "../../styles/Colours";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

const { width, height } = Dimensions.get("window")
const formWidth = 0.8 * width;

export default class GradientButton extends React.Component {
    render() {
        const {onPress, title, width} = this.props;
        return (
            <TouchableOpacity
                style={{width: width}}
                onPress={onPress}
                activeOpacity={0.9}>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={[Colours.blue, Colours.lightBlue]}
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
