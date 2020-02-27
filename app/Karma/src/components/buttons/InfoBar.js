import React from "react";
<<<<<<< HEAD
<<<<<<< HEAD
import {TouchableOpacity, StyleSheet, Image, View} from "react-native";
=======
import {TouchableOpacity, StyleSheet, Image} from "react-native";
>>>>>>> Fix carousel and improve activity card
=======
import {TouchableOpacity, StyleSheet, Image, View} from "react-native";
>>>>>>> Add elements to Activity Cards and all buttons to profile page
import {RegularText} from "../text";

export default class InfoBar extends React.Component {
    render() {
        const {title, image} = this.props;
        return (
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> Add elements to Activity Cards and all buttons to profile page
            <View style={styles.button1}>
                <Image
                    source={image}
                    style={{width: 20, height: 20, resizeMode: "contain"}}
                />
                <RegularText style={styles.titleStyle}>{title}</RegularText>
            </View>
<<<<<<< HEAD
=======
            <TouchableOpacity
                style={styles.button1}>
                    <Image source={image} style={{width: 20, height: 20, resizeMode: 'contain'}}></Image>
                    <RegularText style={styles.titleStyle}>
                        {title}
                    </RegularText>
            </TouchableOpacity>
>>>>>>> Fix carousel and improve activity card
=======
>>>>>>> Add elements to Activity Cards and all buttons to profile page
        );
    }
}
const styles = StyleSheet.create({
    button1: {
<<<<<<< HEAD
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
=======
>>>>>>> Add elements to Activity Cards and all buttons to profile page
        padding: 5,
        paddingHorizontal: 15,
        alignItems: "flex-start",
        flexDirection: "row",
        borderRadius: 32,
        backgroundColor: "#01a7a6",
<<<<<<< HEAD
>>>>>>> Fix carousel and improve activity card
=======
        marginRight: 10,
>>>>>>> Add elements to Activity Cards and all buttons to profile page
    },
    titleStyle: {
        fontSize: 15,
        paddingLeft: 5,
<<<<<<< HEAD
<<<<<<< HEAD
        color: "white",
    },
});
=======
        color: "white"
    }
});
>>>>>>> Fix carousel and improve activity card
=======
        color: "white",
    },
});
>>>>>>> Add elements to Activity Cards and all buttons to profile page
