import React, {Component} from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View,
    Alert,
} from "react-native";
import {RegularText} from "../../components/text";
import Styles from "../../styles/Styles";
import Colours from "../../styles/Colours";
import PageHeader from "../../components/PageHeader";
import {GradientButton} from "../../components/buttons";
import {hasNotch} from "react-native-device-info";
import ProgressBar from "../../components/ProgressBar";
import Communications from "react-native-communications";
import {getDate, formatAMPM} from "../../util/DateTimeInfo";
import MapView from "react-native-maps";
import BottomModal from "../../components/BottomModal";
import SignUpActivity from "../../components/activities/SignUpActivity";
import {getAuthToken} from "../../util/credentials";

import request from "superagent";

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
    constructor(props) {
        super(props);
        this.state = {
            displaySignupModal: false,
            addInfo: false,
            photoId: false,
            physical: false,
            womenOnly: false,
            spots_taken: 3,
            spots: 4,
            activity_name: "Activity Name",
            org_name: "Name",
            location: "Location",
            full_date: "Full Date",
            full_time: "Full Time",
            full_location: "Full Location",
            lat: 37.78825,
            long: -122.4324,
            description:
                "sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua",
            contact:
                "sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua",
            where:
                "sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua",
            important:
                "sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua sed do eiusm ut labore et dolore magna aliqua",
        };
    }

    static navigationOptions = {
        headerShown: false,
    };

    toggleModal = () => {
        this.setState({
            displaySignupModal: !this.state.displaySignupModal,
        });
    };

    handleSignupError = (errorTitle, errorMessage) => {
        Alert.alert(errorTitle, errorMessage);
    };

    getCreatorInfo = async id => {
        const authToken = await getAuthToken();
        const response = await request
            .get("http://localhost:8000/profile")
            .set("authorization", authToken)
            .query({notMyId: id})
            .then(res => {
                return res.body.data;
            });

        const email = response.user.email;

        const eventCreator = response.individual
            ? response.individual
            : response.organisation;
        let fullName = "";
        if (eventCreator.firstName) {
            fullName = eventCreator.firstName + " " + eventCreator.lastName;
        } else {
            fullName =
                eventCreator.pocFirstName + " " + eventCreator.pocLastName;
        }
        const phoneNumber = eventCreator.phoneNumber;
        const org_name = eventCreator.firstName
            ? eventCreator.firstName
            : eventCreator.name;
        const address = eventCreator.address;
        const address1 = address.addressLine1 + ", ";
        const address2 = address.addressLine2
            ? address.addressLine2 + ", "
            : "";
        const city = address.townCity + " ";
        const postcode = address.postCode;
        const full_location = address1 + address2 + city + postcode;

        const long = Number(address.long); //TODO - MapView doesn't update lat/long
        const lat = Number(address.lat);
        this.setState({
            org_name: org_name,
            location: address.townCity,
            full_location: full_location,
            lat: lat,
            long: long,
            email: email,
            fullName: fullName,
            phoneNumber: phoneNumber,
        });
    };

    getEventInfo = activity => {
        this.setState({
            spots_taken: activity.spots - activity.spotsRemaining,
            spots: activity.spots,
            full_date: getDate(activity.date),
            full_time: formatAMPM(activity.date),
            description: activity.content,
            activity_name: activity.name,
            addInfo: activity.addInfo,
            photoId: activity.photoId,
            womenOnly: activity.womenOnly,
            physical: activity.physical,
        });
    };

    async componentDidMount() {
        const activity = this.props.navigation.getParam("activity");

        this.getEventInfo(activity);
        this.getCreatorInfo(
            activity.eventCreatorId
                ? activity.eventCreatorId
                : activity.eventcreatorid,
        );
    }

    render() {
        const signedup = this.props.navigation.getParam("signedup");
        const activity = this.props.navigation.getParam("activity");

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
                                {fontSize: 20, fontWeight: "500"},
                            ]}>
                            {this.state.activity_name}
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
                                        {this.state.org_name}
                                    </RegularText>
                                    <Image />
                                </View>
                                <View style={{width: FORM_WIDTH}}>
                                    <RegularText
                                        style={{
                                            fontSize: 15,
                                            color: Colours.lightGrey,
                                            fontWeight: "500",
                                            flexWrap: "wrap",
                                        }}>
                                        {this.state.location}
                                    </RegularText>
                                </View>
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
                                    <View style={{width: HALF + HALF / 3}}>
                                        <ProgressBar
                                            current={this.state.spots_taken}
                                            max={this.state.spots}
                                        />
                                    </View>
                                    <RegularText style={{fontSize: 16}}>
                                        {this.state.spots_taken}/
                                        {this.state.spots} SPOTS TAKEN
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
                                    {this.state.full_date}
                                </RegularText>
                                <RegularText
                                    style={{
                                        fontSize: 15,
                                        color: Colours.lightGrey,
                                        fontWeight: "500",
                                    }}>
                                    {this.state.full_time}
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
                                    {this.state.full_location}
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
                        <RegularText>{this.state.description}</RegularText>
                        <RegularText style={styles.headerText}>
                            Who to Contact
                        </RegularText>
                        <RegularText>Name: {this.state.fullName}</RegularText>
                        <RegularText>Email: {this.state.email}</RegularText>
                        <RegularText>
                            Number: {this.state.phoneNumber}
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
                                        this.state.phoneNumber,
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
                                        ["emailAddress1"],
                                        null,
                                        null,
                                        "About Your Karma Activity",
                                        null,
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
                        <View style={{height: 200}}>
                            <MapView
                                style={styles.map}
                                initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                                scrollEnabled={false}>
                                <MapView.Marker
                                    coordinate={{
                                        latitude: 37.78825,
                                        longitude: -122.4324,
                                    }}
                                    pinColor={"green"}
                                />
                            </MapView>
                        </View>
                        <RegularText style={styles.headerText}>
                            Important
                        </RegularText>
                        <RegularText>
                            The minimum age for this event is 18.
                        </RegularText>
                        {this.state.photoId && (
                            <RegularText>
                                You will be required to show photo ID upon
                                arrival.
                            </RegularText>
                        )}
                        {this.state.womenOnly && (
                            <RegularText>This event is women only.</RegularText>
                        )}
                        {this.state.physical && (
                            <RegularText>
                                This event involves physical activity.
                            </RegularText>
                        )}
                        {this.state.addInfo && (
                            <RegularText>
                                Additional information will be sent by email.
                            </RegularText>
                        )}
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
                        <GradientButton
                            title="Attend"
                            onPress={() => this.toggleModal()}
                        />
                    </View>
                </View>
                <BottomModal
                    visible={this.state.displaySignupModal}
                    toggleModal={this.toggleModal}>
                    <SignUpActivity
                        activity={activity}
                        onConfirm={this.toggleModal}
                        onError={this.handleSignupError}
                        signedUp={signedup}
                    />
                </BottomModal>
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
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default ActivityInfoScreen;
