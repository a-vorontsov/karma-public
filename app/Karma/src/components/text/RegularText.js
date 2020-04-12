import React from "react";
import {Text, StyleSheet} from "react-native";

export default class RegularText extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {num} = this.props;
        return (
            <Text
                numberOfLines={num}
                style={[styles.text, this.props.style]}
                onPress={this.props.onPress}>
                {this.props.children}
            </Text>
        );
    }

    static defaultProps = {
        num: 0,
    };
}

const styles = StyleSheet.create({
    text: {
        fontFamily: "OpenSans-Regular",
    },
});
