import React from "react";
<<<<<<< HEAD
import {TouchableOpacity, StyleSheet, Image, View} from "react-native";
=======
import {TouchableOpacity, StyleSheet, Image} from "react-native";
>>>>>>> Fix carousel and improve activity card
import {RegularText} from "../text";

export default class InfoBar extends React.Component {
    render() {
        const {title, image} = this.props;
        return (
<<<<<<< HEAD
            <View style={styles.button1}>
                <Image
                    source={image}
                    style={{width: 20, height: 20, resizeMode: "contain"}}
                />
                <RegularText style={styles.titleStyle}>{title}</RegularText>
            </View>
=======
            <TouchableOpacity
                style={styles.button1}>
                    <Image source={image} style={{width: 20, height: 20, resizeMode: 'contain'}}></Image>
                    <RegularText style={styles.titleStyle}>
                        {title}
                    </RegularText>
            </TouchableOpacity>
>>>>>>> Fix carousel and improve activity card
        );
    }
}
const styles = StyleSheet.create({
    button1: {
<<<<<<< HEAD
        padding: 5,
        paddingHorizontal: 15,
        alignItems: "flex-start",
        flexDirection: "row",
        borderRadius: 32,
        backgroundColor: "#01a7a6",
        marginRight: 10,
=======
        flex: 1,
        padding: 5,
        width: 20,
        paddingHorizontal: 10,
        alignItems: "flex-start",
        flexDirection: 'row',
        borderRadius: 32,
        backgroundColor: "#01a7a6",
>>>>>>> Fix carousel and improve activity card
    },
    titleStyle: {
        fontSize: 15,
        paddingLeft: 5,
<<<<<<< HEAD
        color: "white",
    },
});
=======
        color: "white"
    }
});
>>>>>>> Fix carousel and improve activity card
