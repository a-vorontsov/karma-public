import React, {Component} from "react";
import {View, Image, Dimensions, Text} from "react-native";
import {RegularText, BoldText} from "../components/text";
import Styles from "../styles/Styles";
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;

export default class NotificationItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {data} = this.props;

        return (
            <View
                style={[
                    Styles.container,
                    {
                        width: FORM_WIDTH,
                        flexDirection: "row",
                        paddingBottom: 10,
                    },
                ]}>
                <Image
                    style={{
                        paddingVertical: 5,
                        width: 50,
                        height: 50,
                        borderRadius: 5,
                    }}
                    resizeMode="cover"
                    source={require("../assets/images/general-logos/photo-logo.png")}
                />
                <View style={{paddingLeft: 10, justifyContent: "center"}}>
                    <Text>
                        <BoldText>The P.E.E.R Center</BoldText>
                        
                        <RegularText>{data.title}</RegularText>
                    </Text>
                </View>
            </View>
        );
    }
}
