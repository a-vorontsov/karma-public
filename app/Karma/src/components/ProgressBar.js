import React, {Component} from "react";
import {View, Animated, Text, StyleSheet} from "react-native";
import Styles from "../styles/Styles";
import Colours from "../styles/Colours";

export default class ProgressBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {current, max} = this.props;
        const progress =
            Math.abs(current) > Math.abs(max)
                ? 100
                : (Math.abs(current) / Math.abs(max)) * 100;

        return (
            <View style={[Styles.progressBar, this.props.style]}>
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: Colours.blue,
                            width: `${progress}%`,
                            borderRadius: 10,
                        },
                    ]}
                />
            </View>
        );
    }
}
