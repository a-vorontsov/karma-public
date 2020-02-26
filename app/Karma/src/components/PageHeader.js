<<<<<<< HEAD
import React from 'react';
import { View, SafeAreaView, Dimensions, TouchableOpacity, Image} from 'react-native';
import { RegularText} from "../components/text";
import Styles from "../styles/Styles";
=======
import React from "react";
import {
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Image,
} from "react-native";
import {RegularText} from "../components/text";
>>>>>>> Fix carousel and improve activity card

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

export default class PageHeader extends React.Component {
    render() {
        const {onPress, title} = this.props;
        return (
<<<<<<< HEAD
            <SafeAreaView style={{ paddingTop: 0, flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', width: formWidth}}>
            <View style={{paddingTop: 30}}></View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                onPress={onPress}>
                    <Image 
=======
            <SafeAreaView
                style={{
                    paddingTop: 100,
                    flex: 1,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: formWidth,
                }}>
                <View style={{paddingTop: 30}} />
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <TouchableOpacity onPress={onPress}>
                        <Image
                            style={{
                                flex: 1,
                                width: 25,
                                height: 25,
                                resizeMode: "contain",
                            }}
                            source={require("../assets/images/general-logos/back-arrow.png")}
                        />
                    </TouchableOpacity>
                    <RegularText
>>>>>>> Fix carousel and improve activity card
                        style={{
                            fontSize: 30,
                            fontWeight: "500",
                            color: "#3E3E3E",
                            paddingLeft: 20,
                        }}>
                        {this.props.title}
                    </RegularText>
                </View>
            </SafeAreaView>
        );
    }
}
