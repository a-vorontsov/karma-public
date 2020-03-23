import React from "react";

import {TouchableOpacity, View, Image, Alert} from "react-native";

import Styles from "../../styles/Styles";
import {RegularText} from "../text";
import Colours from "../../styles/Colours";
import request from "superagent";
const icons = {
    check: require("../../assets/images/general-logos/green-check.png"),
    cancel: require("../../assets/images/general-logos/cancel.png"),
};

export default class SignUpRequest extends React.Component {
    signUserUp = async accept => {
        const {user, activity} = this.props;

        const body = {
            userId: user.userId,
            confirmed: accept,
            attended: false,
        };

        await request
            .post(`http://localhost:8000/event/${activity.id}/signUp/update`)
            .send(body)
            .then(res => {
                console.log(res.body.data);
                this.props.onSubmit();
            })
            .catch(err => {
                if (accept) {
                    Alert.alert(
                        "Unable to confirm a user's sign up at this time.",
                        err,
                    );
                } else {
                    Alert.alert(
                        "Unable to confirm a user's sign up at this time.",
                        err,
                    );
                }
            });
    };

    render() {
        const {user} = this.props;

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
                    <TouchableOpacity style={{width: 150}}>
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
                                this.signUserUp(true);
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
                                this.signUserUp(false);
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
