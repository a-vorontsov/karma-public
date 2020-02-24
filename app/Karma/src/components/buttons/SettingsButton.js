import React from "react";

import {Image, TouchableOpacity, View} from "react-native";

import { RegularText } from "../text";

import Colours from "../../styles/Colours";

export default class SettingsButton extends React.Component {
    render() {
        const {onPress, title, icon} = this.props;
        return (
            <TouchableOpacity
                style={{
                    borderBottomColor: Colours.lighterGrey,
                    borderBottomWidth: 2,
                    flexDirection: "row",
                    alignItems: "center",
                }}
                onPress={onPress}
                activeOpacity={0.9}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                    }}>
                    <Image
                        style={{height: 20, width: 20, resizeMode: "contain"}}
                        source={icon}
                    />
                    <RegularText
                        style={{
                            fontSize: 20,
                            color: "gray",
                            paddingVertical: 25,
                            paddingLeft: 15,
                        }}>
                        {title}
                    </RegularText>
                </View>
            </TouchableOpacity>
        );
    }
}
