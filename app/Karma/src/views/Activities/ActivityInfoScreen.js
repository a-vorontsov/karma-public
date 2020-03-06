import React, {Component} from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    SafeAreaView,
    Image,
    ScrollView,
    TouchableOpacity,
    Switch,
} from "react-native";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import CarouselStyles from "../../styles/CarouselStyles";
import ActivityCard from "../../components/activities/ActivityCard";
import PageHeader from "../../components/PageHeader";
import {GradientButton, Button} from "../../components/buttons";
import {hasNotch} from "react-native-device-info";
import ProgressBarCustom from "../../components/ProgressBarCustom";
import Communications from "react-native-communications";

const carouselEntries = [{individual: true}];

const {height: SCREEN_HEIGHT, width} = Dimensions.get("window");
const FORM_WIDTH = 0.8 * width;
const HALF = FORM_WIDTH / 2;

const icons = {
    share: require("../../assets/images/general-logos/export-logo.png"),
    profile: require("../../assets/images/general-logos/globe.png"),
    fave_inactive: require("../../assets/images/general-logos/fav-outline-profile.png"),
    fave_active: require("../../assets/images/general-logos/heart-red.png"),
    grey_circle: require("../../assets/images/general-logos/circle-grey.png"),
    calendar: require("../../assets/images/general-logos/calendar-light.png"),
    location: require("../../assets/images/general-logos/location-logo.png"),
    date: require("../../assets/images/general-logos/rectangle-blue.png"),
};

class ActivityInfoScreen extends Component {
    static navigationOptions = {
        headerShown: false,
    };

    render() {
        return (
            <View style={[Styles.container, {backgroundColor: Colours.white}]}>
                {/* HEADER */}
                <View
                    style={[
                        Styles.ph24,
                        {
                            alignItems: "flex-start",
                            height: 0.08 * SCREEN_HEIGHT,
                            maxHeight: 0.15 * SCREEN_HEIGHT,
                            justifyContent: "flex-start",
                            marginTop: hasNotch()
                                ? 40
                                : StatusBar.currentHeight,
                            backgroundColor: Colours.white,
                            marginBottom: 20,
                        },
                    ]}>
                    <View style={{alignItems: "flex-start", width: FORM_WIDTH}}>
                        <PageHeader />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            flex: 1,
                            flexWrap: "wrap",
                        }}>
                        <RegularText
                            style={[
                                Styles.pv16,
                                {fontSize: 25, fontWeight: "500"},
                            ]}>
                            Activity Name Activity
                        </RegularText>
                    </View>
                </View>

                <ScrollView>
                    {/* CARD HEADER */}
                    <View
                        style={{
                            backgroundColor: Colours.backgroundWhite,
                            height: 60,
                            paddingHorizontal: 24,
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                        <Image
                            source={icons.profile}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 75,
                                paddingHorizontal: 24,
                            }}
                            resizeMode="cover"
                        />
                        <View style={{alignItems: "center"}}>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    marginLeft: 15,
                                }}>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyItems: "flex-start",
                                    }}>
                                    <RegularText
                                        style={{
                                            fontSize: 20,
                                            color: Colours.black,
                                            fontWeight: "500",
                                        }}>
                                        Name
                                    </RegularText>
                                    <Image />
                                </View>
                                <RegularText
                                    style={{
                                        fontSize: 15,
                                        color: Colours.lightGrey,
                                        fontWeight: "500",
                                    }}>
                                    Location
                                </RegularText>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItem: "flex-end",
                                justifyContent: "flex-end",
                            }}>
                            <TouchableOpacity style={{alignSelf: "flex-end"}}>
                                <Image
                                    source={icons.share}
                                    style={{
                                        alignSelf: "flex-end",
                                        width: 30,
                                        height: 30,
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* CARD */}
                    <View style={[Styles.container, Styles.ph24]}>
                        <View style={[Styles.pb24, Styles.bottom]}>
                            <Image
                                source={require("../../assets/images/general-logos/hands-heart.png")}
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: 200,
                                    marginBottom: 10,
                                }}
                                resizeMode="cover"
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
                            <Image
                                source={icons.grey_circle}
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
                                source={icons.fave_active}
                                style={{
                                    position: "absolute",
                                    top: 16,
                                    right: 15,
                                    height: 30,
                                    width: 30,
                                    resizeMode: "contain",
                                }}
                            />
                            <RegularText
                                style={[styles.dateText, {top: 5, left: 0}]}>
                                {" "}
                                DAY
                            </RegularText>
                            <RegularText
                                style={[styles.dateText, {top: 25, left: 0}]}>
                                {" "}
                                MON
                            </RegularText>
                            <View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}>
                                    <ProgressBarCustom />
                                    <RegularText>
                                        3/4 Spots Available
                                    </RegularText>
                                </View>
                            </View>
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
                                    Full Date
                                </RegularText>
                                <RegularText
                                    style={{
                                        fontSize: 15,
                                        color: Colours.lightGrey,
                                        fontWeight: "500",
                                    }}>
                                    Full Time
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
                                    Full Location
                                </RegularText>
                            </View>
                        </View>
                    </View>

                    {/* INFORMATION */}
                    <View
                        style={[
                            Styles.ph24,
                            Styles.pv16,
                            {backgroundColor: Colours.backgroundWhite},
                        ]}>
                        <RegularText style={styles.headerText}>
                            What Will Volunteers Do?
                        </RegularText>
                        <RegularText>
                            sed do eiusm ut labore et dolore magna aliqua sed do
                            eiusm ut labore et dolore magna aliqua sed do eiusm
                            ut labore et dolore magna aliqua
                        </RegularText>
                        <RegularText style={styles.headerText}>
                            Who to Contact
                        </RegularText>
                        <RegularText>
                            sed do eiusm ut labore et dolore magna aliqua sed do
                            eiusm ut labore et dolore magna aliqua sed do eiusm
                            ut labore et dolore magna aliqua
                        </RegularText>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 10,
                            }}>
                            <TouchableOpacity
                                style={styles.contactButton}
                                activeOpacity={0.9}
                                onPress={() =>
                                    Communications.phonecall(
                                        phoneNumbers[0].number,
                                        true,
                                    )
                                }>
                                <RegularText
                                    style={{
                                        fontSize: 18,
                                        color: Colours.white,
                                    }}>
                                    CALL
                                </RegularText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.contactButton}
                                activeOpacity={0.9}
                                onPress={() =>
                                    Communications.email(
                                        ["emailAddress1", "emailAddress2"],
                                        null,
                                        null,
                                        "My Subject",
                                        "My body text",
                                    )
                                }>
                                <RegularText
                                    style={{
                                        fontSize: 18,
                                        color: Colours.white,
                                    }}>
                                    EMAIL
                                </RegularText>
                            </TouchableOpacity>
                        </View>
                        <RegularText style={styles.headerText}>
                            Where
                        </RegularText>
                        <RegularText>
                            sed do eiusm ut labore et dolore magna aliqua sed do
                            eiusm ut labore et dolore magna aliqua sed do eiusm
                            ut labore et dolore magna aliqua
                        </RegularText>
                        <View
                            styles={{
                                flex: 1,
                                height: 10,
                                width: 30,
                                backgroundColor: "red",
                                alignSelf: "center",
                            }}
                        />
                        <RegularText style={styles.headerText}>
                            Important
                        </RegularText>
                        <RegularText>
                            sed do eiusm ut labore et dolore magna aliqua sed do
                            eiusm ut labore et dolore magna aliqua sed do eiusm
                            ut labore et dolore magna aliqua
                        </RegularText>
                    </View>
                </ScrollView>

                {/** NEXT BUTTON */}
                <View
                    style={{
                        height: 0.08 * SCREEN_HEIGHT,
                        justifyContent: "flex-end",
                        alignItems: "center",
                        marginBottom: 30,
                        backgroundColor: Colours.white,
                    }}>
                    <View style={{width: FORM_WIDTH}}>
                        <GradientButton title="Attend" />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerText: {
        fontSize: 20,
        fontWeight: "500",
        color: Colours.black,
        paddingVertical: 10,
    },
    dateText: {
        position: "absolute",
        height: 50,
        width: 50,
        fontSize: 20,
        textAlign: "center",
        fontWeight: "500",
        color: "white",
    },
    contactButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 32,
        height: 40,
        width: HALF,
        backgroundColor: Colours.blue,
        marginVertical: 10,
    },
});

export default ActivityInfoScreen;
