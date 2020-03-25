import React from "react";

import {Image, TouchableOpacity, View} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import Communications from "react-native-communications";
import {sendNotification} from "../../util/SendNotification";

const icons = {
    email: require("../../assets/images/general-logos/mail.png"),
};

export default class AttendeeButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            attendeeId: -1,
        };
    }

    async componentDidMount() {
        this.parseProfileInfo();
    }

    parseProfileInfo = () => {
        const {user, activity} = this.props;
        const email = user.email;
        const attendeeId = user.userId;
        this.setState({
            email,
            attendeeId,
            activity,
        });
    };

    openEmail = async () => {
        const {email, attendeeId, activity} = this.state;
        sendNotification(
            "Message",
            "has sent you a message - check your inbox!",
            [attendeeId],
        );
        Communications.email(
            [email],
            null,
            null,
            `Karma - ${activity.name}`,
            null,
        );
    };

    render() {
        const {user} = this.props;
        return (
            <View style={[Styles.pv8]}>
                <View
                    style={[
                        Styles.pv8,
                        {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            backgroundColor: Colours.white,
                            borderWidth: 3,
                            borderColor: Colours.grey,
                        },
                    ]}
                    activeOpacity={0.9}>
                    <View style={{flex: 9}}>
                        <RegularText style={[Styles.ph8, {fontSize: 20}]}>
                            {user.firstName
                                ? user.firstName + " " + user.lastName
                                : user.name}
                        </RegularText>
                    </View>
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                            onPress={() => {
                                this.openEmail();
                            }}
                            style={{
                                width: 30,
                                paddingRight: 15,
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                            }}>
                            <Image
                                source={icons.email}
                                style={{
                                    height: 30,
                                    alignSelf: "center",
                                    justifyContent: "flex-end",
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}
