import React from "react";
import {StyleSheet, Image, View} from "react-native";
import {RegularText} from "../text";

export default class InfoBar extends React.Component {
    render() {
        const {title, image} = this.props;
        return (
            <View style={styles.button1}>
                <View style={{alignSelf: "center"}}>
                    <Image
                        source={image}
                        style={{width: 10, height: 10, resizeMode: "contain"}}
                    />
                </View>
                <RegularText style={styles.titleStyle}>{title}</RegularText>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    button1: {
        padding: 5,
        paddingHorizontal: 15,
        alignItems: "flex-start",
        flexDirection: "row",
        borderRadius: 32,
        backgroundColor: "#01a7a6",
        marginRight: 10,
    },
    titleStyle: {
        fontSize: 15,
        paddingLeft: 5,
        color: "white",
    },
});
