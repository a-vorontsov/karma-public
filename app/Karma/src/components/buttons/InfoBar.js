import React from "react";
import {TouchableOpacity, StyleSheet, Image} from "react-native";
import {RegularText} from "../text";

export default class InfoBar extends React.Component {
    render() {
        const {title, image} = this.props;
        return (
            <TouchableOpacity
                style={styles.button1}>
                    <Image source={image} style={{width: 20, height: 20, resizeMode: 'contain'}}></Image>
                    <RegularText style={styles.titleStyle}>
                        {title}
                    </RegularText>
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    button1: {
        flex: 1,
        padding: 5,
        width: 20,
        paddingHorizontal: 10,
        alignItems: "flex-start",
        flexDirection: 'row',
        borderRadius: 32,
        backgroundColor: "#01a7a6",
    },
    titleStyle: {
        fontSize: 15,
        paddingLeft: 5,
        color: "white"
    }
});