import React from "react";
import {
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Image,
} from "react-native";
import {RegularText} from "../components/text";
import {useNavigation} from "react-navigation-hooks";
import Colours from "../styles/Colours";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

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
