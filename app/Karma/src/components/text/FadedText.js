import React from "react";
import {StyleSheet} from "react-native";
import BoldText from "./BoldText";
import Colours from "../../styles/Colours";

export default class FadedText extends React.Component {
    render() {
        return (
            <BoldText
                style={[styles.text, this.props.style]}
                onPress={this.props.onPress}>
                {this.props.children}
            </BoldText>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: Colours.lightGrey,
    },
});
