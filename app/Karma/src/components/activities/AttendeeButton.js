import React from "react";

import {Image, TouchableOpacity, View} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import Communications from "react-native-communications";
import {sendNotification} from "../../util/SendNotification";
import {getData} from "../../util/GetCredentials";

const icons = {
    email: require("../../assets/images/general-logos/mail.png"),
};

export default class AttendeeButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            name: "",
        };
    }

    async componentDidMount() {
        this.parseProfileInfo();
    }

    parseProfileInfo = () => {
        const {profile, attendeeId} = this.props;
        let email = profile.user.email;
        let userType = profile.individual
            ? profile.individual
            : profile.organisation;
        let name = userType.firstName
            ? userType.firstName + " " + userType.lastName
            : userType.name;

        this.setState({
            email: email,
            name: name,
            attendeeId: Number(attendeeId),
        });
    };

    openEmail = async () => {
        const credentials = await getData();
        const {email} = this.state;
        sendNotification(
            "Message",
            "has sent you a message - check your inbox!",
            Number(credentials.username),
            [this.state.attendeeId],
        );
        Communications.email([email], null, null, null, null);
    };

    render() {
        const {name} = this.state;
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
                            {name}
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
