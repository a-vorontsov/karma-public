import React from "react";
import {View, TouchableOpacity, Image} from "react-native";
import {RegularText} from "../components/text";
import { useNavigation } from "react-navigation-hooks";

const PageHeader = props => {
    const navigation = useNavigation();
    const {title} = props;
    return (
        <View>
            <View style={{paddingTop: 24}} />
            <View style={{flexDirection: "row", alignItems: "center"}}>
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
                <RegularText
                    style={{
                        fontSize: 24,
                        fontWeight: "600",
                        color: "grey",
                        paddingLeft: 16,
                    }}>
                    {title}
                </RegularText>
            </View>
        </View>
    );
};

export default PageHeader;
