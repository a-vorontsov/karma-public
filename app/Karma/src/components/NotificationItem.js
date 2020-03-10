import React, {Component} from "react";
import {View, Image, Dimensions, Text} from "react-native";
import {
    RegularText,
    BoldText,
    LinkText,
    SemiBoldText,
} from "../components/text";
import Styles from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";
import {TouchableOpacity} from "react-native-gesture-handler";
import Colours from "../styles/Colours";
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
                        paddingTop: 10,
                        paddingBottom: 10,
                    },
                ]}>
                <Image
                    style={{
                        paddingVertical: 5,
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                    }}
                    resizeMode="cover"
                    source={data.logo}
                />
                <View
                    style={{
                        paddingLeft: 10,
                        justifyContent: "center",
                        width: "80%",
                    }}>
                    <Text>
                        <BoldText>{data.org}</BoldText>

                        <RegularText>{" " + data.title}</RegularText>
                        <RegularText style={SignUpStyles.text}>
                            {" " + 7 * data.weeks_ago + "d"}
                        </RegularText>
                    </Text>
                    {data.type === "messageSent" ? (
                        <TouchableOpacity>
                            <SemiBoldText style={{color: Colours.blue}}>
                                Reply
                            </SemiBoldText>
                        </TouchableOpacity>
                    ) : (
                        undefined
                    )}
                </View>
            </View>
        );
    }
}
