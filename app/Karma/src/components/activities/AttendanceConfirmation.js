import React from "react";

import {TouchableOpacity, View, Image, Alert} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import request from "superagent";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";

const icons = {
    check: require("../../assets/images/general-logos/green-check.png"),
    cancel: require("../../assets/images/general-logos/cancel.png"),
};

export default class AttendanceConfirmation extends React.Component {
    confirmAttendance = async attended => {
        const {user, activity} = this.props;

        const body = {
            otherUserId: user.userId,
            attended: attended,
            confirmed: true,
        };

        const authToken = await getAuthToken();

        // SEND CONFIRMATION OF ATTENDANCE OR NOT
        await request
            .post(`${REACT_APP_API_URL}/event/${activity.id}/signUp/update`)
            .send(body)
            .set("authorization", authToken)
            .then(res => {
                this.props.onSubmit();
            })
            .catch(err => {
                if (attended) {
                    Alert.alert(
                        "Unable to confirm the user's attendance at this time.",
                        err,
                    );
                } else {
                    Alert.alert(
                        "Unable to confirm the user's absence at this time.",
                        err,
                    );
                }
            });
    };

    render() {
        const {user, navigation} = this.props;

        return (
            <View style={[Styles.pv8, Styles.ph8]}>
                <View
                    style={[
                        Styles.pv8,
                        {
                            flexDirection: "row",
                            alignItems: "flex-start",
                            justifyContent: "space-between",
                            backgroundColor: Colours.white,
                            borderWidth: 3,
                            borderColor: Colours.grey,
                        },
                    ]}
                    activeOpacity={0.9}>
                    <TouchableOpacity
                        style={{width: 150}}
                        onPress={() => {
                            navigation.push("Profile", {
                                profile: user,
                            });
                        }}>
                        <RegularText style={[Styles.ph8, {fontSize: 20}]}>
                            {user.firstName
                                ? user.firstName + " " + user.lastName
                                : user.name}
                        </RegularText>
                    </TouchableOpacity>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                        }}>
                        {/** APPROVE A USER */}
                        <TouchableOpacity
                            onPress={() => {
                                this.confirmAttendance(true);
                            }}>
                            <Image
                                source={icons.check}
                                style={{
                                    height: 30,
                                    width: 30,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                        {/** DISAPPROVE A USER */}
                        <TouchableOpacity
                            onPress={() => {
                                this.confirmAttendance(false);
                            }}>
                            <Image
                                source={icons.cancel}
                                style={{
                                    width: 30,
                                    height: 30,
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
