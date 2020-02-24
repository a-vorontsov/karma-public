import React from "react";
import {StyleSheet} from "react-native";
import RegularText from "./RegularText";

export default class TitleText extends React.Component {
    render() {
        return (
            <RegularText
                style={[styles.title, this.props.style]}
                onPress={this.props.onPress}>
                {this.props.children}
            </RegularText>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
    },
});
