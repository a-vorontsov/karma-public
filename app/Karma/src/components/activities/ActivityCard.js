import React from "react";

import {InfoBar} from "../buttons";
import {Image, StyleSheet, View, TouchableOpacity, Alert} from "react-native";
import {RegularText} from "../text";
import Styles from "../../styles/Styles";
import ReadMore from "react-native-read-more-text";
import {useNavigation} from "react-navigation-hooks";
import BottomModal from "../BottomModal";
import SignUpActivity from "./SignUpActivity";
import Colours from "../../styles/Colours";
import {getAuthToken} from "../../util/credentials";
import {REACT_APP_API_URL} from "react-native-dotenv";
const request = require("superagent");
const icons = {
    fave_inactive: require("../../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../../assets/images/general-logos/heart-red.png"),
    clock: require("../../assets/images/general-logos/clock-logo.png"),
    people: require("../../assets/images/general-logos/people-logo.png"),
    signup: require("../../assets/images/general-logos/favourite.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
    tick: require("../../assets/images/general-logos/password-tick.png"),
};

function formatAMPM(d) {
    let date = new Date(d);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
}

function getMonthName(d, long = false) {
    let date = new Date(d);
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
    var name = monthNames[date.getMonth()];
    if (!long) {
        name = name.substring(0, 3);
    }
    return name;
}

/*
    The ActivityCard class provides information about an activity
    and displays it to the user. It fetches information from the
    server based on how a user has previously interacted with the
    activity, and implements those changes based on the server response.

*/

class ActivityCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySignupModal: false,
            favourited: props.favourited
                ? props.favourited
                : props.activity.favourited,
            signedup: props.signedup,
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.toggleFavourite = this.toggleFavourite.bind(this);
    }

    toggleSignup = () => {
        this.setState({
            signedup: !this.state.signedup,
            displaySignupModal: !this.state.displaySignupModal,
        });
    };

    toggleModal = () => {
        this.setState({
            displaySignupModal: !this.state.displaySignupModal,
        });
    };

    handleSignupError = (errorTitle, errorMessage) => {
        Alert.alert(errorTitle, errorMessage);
    };

    /**ToggleFavourite method sends a POST request to the backend server,
     * and changes the favourite indicator on the display accordingly. 
     * */
    
    async toggleFavourite() {
        const authToken = await getAuthToken();

        if (!this.state.favourited) {
            request
                .post(
                    `${REACT_APP_API_URL}/event/${
                        this.props.activity.eventId
                    }/favourite`,
                )
                .set("authorization", authToken)
                .then(result => {
                    console.log(result.body.message);
                    this.setState({
                        favourited: true,
                    });
                })
                .catch(er => {
                    console.log(er);
                });
        } else {
            request
                .post(
                    `${REACT_APP_API_URL}/event/${
                        this.props.activity.eventId
                    }/favourite/delete`,
                )
                .set("authorization", authToken)
                .then(result => {
                    console.log(result.body.message);
                    this.setState({
                        favourited: false,
                    });
                })
                .catch(er => {
                    console.log(er);
                });
        }
    }

    /**
     * Handles the length of the description of an activity via a 'Read More' button
     */
    _renderTruncatedFooter = handlePress => {
        const {signedup} = this.state;
        const {activity, isOrganisation} = this.props;
        return (
            <TouchableOpacity
                onPress={() =>
                    this.props.navigation.push("ActivityInfo", {
                        activity: activity,
                        signedup: signedup,
                        favourited: this.state.favourited,
                        isOrganisation: isOrganisation,
                    })
                }>
                <RegularText
                    style={{color: Colours.lightBlue, marginTop: 5}}
                    onPress={handlePress}>
                    READ MORE
                </RegularText>
            </TouchableOpacity>
        );
    };
    render() {
        const {signedup} = this.state;
        const {activity, isOrganisation} = this.props;

        return (
            <View style={[Styles.container, Styles.ph24]}>
                <View style={[Styles.pb24, Styles.bottom]}>
                    <Image
                        source={{
                            uri: `https://picsum.photos/seed/${
                                this.props.activity.eventId
                            }/800/200`,
                        }}
                        style={{
                            flex: 1,
                            width: null,
                            height: null,
                            marginBottom: 10,
                        }}
                        resizeMode="cover"
                    />

                    {!isOrganisation && (
                        <TouchableOpacity
                            opacity={0.9}
                            onPress={() => this.toggleModal()}
                            style={{
                                position: "absolute",
                                right: 0,
                                top: 0,
                                padding: 5,
                            }}>
                            <Image
                                source={signedup ? icons.tick : icons.signup}
                                style={{
                                    height: 50,
                                    width: 50,
                                    resizeMode: "contain",
                                }}
                            />
                        </TouchableOpacity>
                    )}
                    <Image
                        source={icons.date}
                        style={[styles.icon, {left: 5}]}
                    />
                    <RegularText style={[styles.dateText, {top: 5, left: 1}]}>
                        {` ${new Date(activity.date).getDate()}`}
                    </RegularText>
                    <RegularText style={styles.dateText}>
                        {`  ${getMonthName(activity.date)}`}
                    </RegularText>
                    <View>
                        <View
                            style={{
                                flexDirection: "row",
                            }}>
                            <InfoBar
                                title={` ${formatAMPM(activity.date)}`}
                                image={icons.clock}
                            />

                            <InfoBar
                                title={`${activity.spots -
                                    activity.volunteers.length} Spots Left`}
                                image={icons.people}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                }}>
                                <TouchableOpacity
                                    style={{alignSelf: "center"}}
                                    onPress={this.toggleFavourite}>
                                    <Image
                                        source={
                                            this.state.favourited
                                                ? icons.fave_active
                                                : icons.fave_inactive
                                        }
                                        style={{
                                            width: 30,
                                            height: 30,
                                            resizeMode: "contain",
                                            marginRight: -5,
                                        }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <RegularText
                            style={{
                                fontWeight: "500",
                                fontSize: 20,
                                marginVertical: 8,
                            }}>
                            {activity.name}
                        </RegularText>
                    </View>
                    <View>
                        {this._renderTruncatedFooter()}
                        <ReadMore
                            numberOfLines={2}
                            renderTruncatedFooter={this._renderTruncatedFooter}
                        />
                    </View>
                </View>
                <BottomModal
                    visible={this.state.displaySignupModal}
                    toggleModal={this.toggleModal}>
                    <SignUpActivity
                        activity={activity}
                        onConfirm={this.toggleSignup}
                        onError={this.handleSignupError}
                        signedUp={signedup}
                    />
                </BottomModal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dateText: {
        position: "absolute",
        top: 25,
        left: 0,
        height: 50,
        width: 50,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        color: "white",
    },
    icon: {
        position: "absolute",
        top: 5,
        right: 5,
        height: 50,
        width: 50,
        resizeMode: "contain",
    },
});

export default props => {
    const navigation = useNavigation();
    return <ActivityCard {...props} navigation={navigation} />;
};
