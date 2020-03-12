import React from "react";
import {Image, TouchableOpacity, View} from "react-native";
import {useNavigation} from "react-navigation-hooks";
import {RegularText} from "../components/text";
import Colours from "../styles/Colours";

const PageHeader = props => {
    const navigation = useNavigation();
    const {title} = props;
    return (
        <View>
            <View style={{paddingTop: 24}} />
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                {props.disableBack ? null : (
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            style={{
                                flex: 1,
                                width: 24,
                                height: 24,
                                resizeMode: "contain",
                            }}
                            source={require("../assets/images/general-logos/back-arrow.png")}
                        />
                    </TouchableOpacity>
                )}
                <RegularText
                    style={{
                        fontSize: 24,
                        fontWeight: "600",
                        color: Colours.black,
                        paddingLeft: 16,
                    }}>
                    {title}
                </RegularText>
            </View>
        </View>
    );
};

export default PageHeader;
