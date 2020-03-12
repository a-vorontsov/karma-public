import React, {Component} from "react";
import {View, Image, Dimensions, Text} from "react-native";
import {
    RegularText,
    BoldText,
    LinkText,
    SemiBoldText,
} from "../components/text";
import Styles, {normalise} from "../styles/Styles";
import SignUpStyles from "../styles/SignUpStyles";
import {TouchableOpacity} from "react-native-gesture-handler";
import Colours from "../styles/Colours";
const {width: SCREEN_WIDTH} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * SCREEN_WIDTH;

/**
 * Notification types:
 * -- "Message" --
 * -- "Confirmation" --
 * -- "Cancellation" --
 */
export default class NotificationItem extends Component {
    constructor(props) {
        super(props);
    }

    /**
     * Opens email app on the user's phone
     */
    _sendReply = () => {
        //open email here
    }

    _renderReplyButton = () => {
        return (
            <TouchableOpacity onPress={() => this._sendReply()}>
                <SemiBoldText style={{color: Colours.blue}}>Reply</SemiBoldText>
            </TouchableOpacity>
        );
    };

    render() {
        const {notification} = this.props;
        const isMessage = notification.type === "Message";
        const randNum = Math.floor(Math.random() * 200);
        return (
            <>
                <View style={[Styles.pb16, {flexDirection: "row"}]}>
                    <Image
                        style={{height: 40, width: 40, borderRadius: 20, alignSelf:"center"}}
                        source={{uri:"https://picsum.photos/200"}}
                    />
                    <View style={[Styles.ph16, {alignSelf: "center", flexShrink:1, }]}>
                        <Text>
                            <RegularText>{notification.message}</RegularText>
                            <RegularText style={{color: Colours.grey}}>
                                {" "}
                                {notification.daysAgo}d
                            </RegularText>
                        </Text>
                        {/**
                         * Render the reply button only if the notification type is a 'Message'
                         */}
                        {isMessage && this._renderReplyButton()}
                    </View>
                </View>
            </>
        );
    }
}
