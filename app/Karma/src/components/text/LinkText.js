import React from "react";
import {Text, StyleSheet} from "react-native";
import Colours from "../../styles/Colours";

export default class LinkText extends React.Component {
    render() {
        return (
            <Text
                style={[styles.text, this.props.style]}
                onPress={this.props.onPress}>
                {this.props.children}
            </Text>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "OpenSans-Regular",
        color: Colours.blue,
        textDecorationLine: "underline",
    },
});
