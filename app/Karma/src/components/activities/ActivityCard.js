import React from "react";

import {InfoBar} from "../buttons";
import {View, Image, Text, StyleSheet} from "react-native";
import {RegularText} from "../text";
import Styles from "../../styles/Styles";
import {TouchableOpacity} from "react-native-gesture-handler";
import ReadMore from "react-native-read-more-text";
import {useNavigation} from "react-navigation-hooks";

const icons = {
    fave_inactive: require("../../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../../assets/images/general-logos/heart-red.png"),
    clock: require("../../assets/images/general-logos/clock-logo.png"),
    people: require("../../assets/images/general-logos/people-logo.png"),
    signup: require("../../assets/images/general-logos/favourite.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
};

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

function getMonthName(date, long=false) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var name = monthNames[date.getMonth()];
    if(!long){
        name = name.substring(0,3);
    };
    return name;
}

const ActivityCard = props => {
    const navigation = useNavigation();

    setFav = handlePress => {
        return false;
    };

    _renderTruncatedFooter = handlePress => {
        return (
            <Text
                style={{color: "#00A8A6", marginTop: 5}}
                onPress={() => this.navigation.navigate("ActivityInfo")}>
                READ MORE
            </Text>
        );
    };

    return (
        <View style={[Styles.container, Styles.ph24]}>
            <View style={[Styles.pb24, Styles.bottom]}>
                <Image
                    source={
                        Math.random() >= 0.5 // TODO - use real data
                            ? require("../../assets/images/general-logos/hands-heart.png")
                            : require("../../assets/images/general-logos/globe.png")
                    }
                    style={{
                        flex: 1,
                        width: null,
                        height: null,
                        marginBottom: 10,
                    }}
                    resizeMode="cover"
                />
                <Image
                    source={props.signedup ? null : icons.signup}
                    style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        height: 50,
                        width: 50,
                        resizeMode: "contain",
                    }}
                />
                <Image
                    source={icons.date}
                    style={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        height: 50,
                        width: 50,
                        resizeMode: "contain",
                    }}
                />
                <RegularText
                    style={{
                        position: "absolute",
                        top: 5,
                        left: 1,
                        height: 50,
                        width: 50,
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "500",
                        color: "white",
                    }}>
                    {" "}
                    {props.activity.date.getDate()}
                </RegularText>
                <RegularText
                    style={{
                        position: "absolute",
                        top: 25,
                        left: 0,
                        height: 50,
                        width: 50,
                        fontSize: 20,
                        textAlign: "center",
                        fontWeight: "500",
                        color: "white",
                    }}>
                    {" "}
                    {getMonthName(props.activity.date)}
                </RegularText>
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                        }}>
                        <InfoBar title={formatAMPM(props.activity.date)} image={icons.clock} />
                        <InfoBar title={`${props.activity.remaining_spots} SPOTS LEFT`} image={icons.people} />
                        <View
                            style={{
                                flexDirection: "row",
                            }}>
                            <InfoBar title="TIME" image={icons.clock} />
                            <InfoBar
                                title="0 SPOTS LEFT"
                                image={icons.people}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    alignItems: "flex-end",
                                    justifyContent: "flex-end",
                                }}>
                                <TouchableOpacity style={{alignSelf: "center"}}>
                                    <Image
                                        source={
                                            props.favorited
                                                ? icons.fave_inactive
                                                : icons.fave_active
                                        }
                                        style={{
                                            width: 30,
                                            height: 30,
                                            resizeMode: "contain",
                                            marginRight: 10,
                                        }}
                                        // onPress={this.setFav(!props.favorited)}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <RegularText
                        style={{
                            fontWeight: "500",
                            fontSize: 20,
                            marginVertical: 8,
                        }}>
                        {props.activity.name}
                    </RegularText>
                </View>
                <View>
                    <ReadMore
                        numberOfLines={2}
                        renderTruncatedFooter={this._renderTruncatedFooter}>
                        <RegularText>{props.activity.description}</RegularText>
                    </ReadMore>
                </View>
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
