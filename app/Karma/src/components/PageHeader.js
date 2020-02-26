import React from "react";
import {
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    Image,
} from "react-native";
import {RegularText} from "../components/text";

const {width, height} = Dimensions.get("window");
const formWidth = 0.8 * width;

export default class PageHeader extends React.Component {
    render() {
        const {onPress, title} = this.props;
        return (
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
