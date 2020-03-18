import React from "react";

import {Image, StyleSheet, TouchableOpacity, View, Alert} from "react-native";
import {RegularText} from "../text";
import CarouselStyles from "../../styles/CarouselStyles";
import Colours from "../../styles/Colours";
import {useNavigation} from "react-navigation-hooks";
import {sendNotification} from "../../util/SendNotification";
import Styles from "../../styles/Styles";
import Communications from "react-native-communications";
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from "react-native-popup-menu";

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
    dots: require("../../assets/images/general-logos/triple-dot-blue.png"),
    calendar: require("../../assets/images/general-logos/calendar-light.png"),
    location: require("../../assets/images/general-logos/location-logo.png"),
};

const ActivityEditable = props => {

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

    const navigation = useNavigation();
    const {activity} = props;
    return (

        <View>
            <View
                style={{
                    backgroundColor: Colours.backgroundWhite,
                    height: 30,
                    alignItems: "flex-end",
                }}>
                <View style={{}}>
                    {/* <TouchableOpacity onPress={() => navigation.navigate("ActivityEdit")}> */}
                    <TouchableOpacity>
                        <Menu>
                            <MenuTrigger>
                                <Image
                                    source={icons.dots}
                                    style={{
                                        width: 40,
                                        height: 40,
                                        marginRight: 20,
                                        marginBottom: 10,
                                    }}
                                    resizeMode="contain"
                                />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption
                                    onSelect={() => Alert.alert("Share")}>
                                    <RegularText style={styles.settingsText}>
                                        Share Activity
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() =>
                                        navigation.navigate("ActivityEdit")
                                    }>
                                    <RegularText style={styles.settingsText}>
                                        Edit Activity
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() =>
                                        navigation.navigate("ViewSignUps")
                                    }>
                                    <RegularText style={styles.settingsText}>
                                        View Sign Ups
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => {
                                        sendNotification(
                                            "Message",
                                            "has sent you a message - check your inbox!",
                                        );
                                        Communications.email(
                                            null,
                                            null,
                                            // BCC – array of recipients
                                            ["emailAddress1", "emailAddress2"],
                                            null,
                                            null,
                                        );
                                    }}>
                                    <RegularText style={styles.settingsText}>
                                        Message Attendees
                                    </RegularText>
                                </MenuOption>
                                <MenuOption
                                    onSelect={() => {
                                        sendNotification(
                                            "EventCancellation",
                                            "Event named [EVENT NAME] has been cancelled",
                                        );
                                        Alert.alert(
                                            "Are you sure you want to delete?",
                                        );
                                    }}>
                                    <RegularText style={styles.settingsText}>
                                        Delete Activity
                                    </RegularText>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={CarouselStyles.itemContainer3}>
                <View style={[CarouselStyles.item3]}>
                    <View style={[Styles.container, Styles.ph24]}>
                        <View style={[Styles.pb24, Styles.bottom]}>
                            <Image
                                source={{
                                    uri: `https://picsum.photos/seed/${Math.random()}/800/200`,
                                }}
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: null,
                                    marginBottom: 10,
                                }}
                                resizeMode="cover"
                            />
                            <Image
                                source={icons.date}
                                style={[styles.icon, {left: 5}]}
                            />
                            <RegularText style={[styles.dateText, {top: 5, left: 1}]}>
                                {` ${new Date(activity.date).getDate()}`}
                            </RegularText>
                            <RegularText style={styles.dateText}>
                                {`  ${getMonthName(props.activity.date)}`}
                            </RegularText>
                            <View>
                                <RegularText
                                    style={{
                                        fontWeight: "500",
                                        fontSize: 20,
                                        marginVertical: 8,
                                    }}>
                                    {activity.name || "Full Name"}
                                </RegularText>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "flex-start",
                                }}>
                                <Image
                                    source={icons.calendar}
                                    style={{
                                        alignSelf: "flex-start",
                                        justifyContent: "center",
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                    }}
                                    resizeMode="contain"
                                />
                                <View>
                                    <RegularText
                                        style={{
                                            fontSize: 18,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        {props.activity.date || "Full Date"}
                                    </RegularText>
                                    <RegularText
                                        style={{
                                            fontSize: 15,
                                            color: Colours.lightGrey,
                                            fontWeight: "500",
                                        }}>
                                        {`${formatAMPM(activity.date)}`}
                                    </RegularText>
                                </View>
                            </View>
                            <View style={[Styles.pv16, {flexDirection: "row"}]}>
                                <Image
                                    source={icons.location}
                                    style={{
                                        alignSelf: "flex-start",
                                        justifyContent: "center",
                                        width: 20,
                                        height: 20,
                                        marginRight: 10,
                                    }}
                                    resizeMode="contain"
                                />
                                <View>
                                    <RegularText
                                        style={{
                                            fontSize: 18,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        {activity.address1 + ", " + activity.postcode + ", " + activity.city || "Full Location"}
                                    </RegularText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

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
    settingsText: {
        fontSize: 15,
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

export default ActivityEditable;
